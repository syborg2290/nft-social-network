import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import algosdk from 'algosdk';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './interface/post.interface';
import { User } from '../user/interface/user.interface';

@Injectable()
export class PostService {
  constructor(
    @Inject('POST_MODEL')
    private postModel: Model<Post>,
    @Inject('USER_MODEL')
    private userModel: Model<User>,
    private configService: ConfigService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Object> {
    try {
      const count = await this.getCountOfAllPosts();
      const assetId = await this.mintNFT(
        count,
        createPostDto.file_name,
        createPostDto.asset_url,
        createPostDto.description,
        createPostDto.mime_type,
        createPostDto.properties,
        createPostDto.account_mnemonic,
      );
      if (assetId === null) {
        return {
          error: true,
          body: 'Something went wrong! please try again!',
        };
      }
      const newObj = {
        owner: createPostDto.owner,
        assetId: assetId,
        properties: createPostDto.properties,
        mime_type: createPostDto.mime_type,
        title: createPostDto.title,
        description: createPostDto.description,
        account_mnemonic: createPostDto.account_mnemonic,
      };
      const createpostModel = new this.postModel(newObj);
      return {
        error: false,
        body: await createpostModel.save(),
      };
    } catch (e) {
      Logger.error('Error while creating post: ', e);
      throw new InternalServerErrorException(
        'Server error',
        'Error while creating post',
      );
    }
  }

  async getCountOfAllPosts() {
    try {
      const postsCount = await (await this.postModel.find()).length;
      return postsCount;
    } catch (e) {
      Logger.error('Error while creating post: ', e);
      throw new InternalServerErrorException(
        'Server error',
        'Error while creating post',
      );
    }
  }

  async getAllPosts() {
    try {
      let posts = [];
      const postsArr = await this.postModel
        .find()
        .populate({ path: 'owner', model: this.userModel })
        .exec();
      for (var i = 0; i < postsArr.length; i++) {
        const nftInfo = await this.getAssetById(postsArr[i].assetId);
        const newObj = {
          postId: postsArr[i]._id,
          owner: postsArr[i].owner,
          nftOwner: nftInfo[0].params.manager,
          nftUrl: nftInfo[0].params.url,
          properties: postsArr[i].properties,
          mime_type: postsArr[i].mime_type,
          title: postsArr[i].title,
          description: postsArr[i].description,
          createdAt: postsArr[i].createdAt,
        };
        posts.push(newObj);
      }
      return posts;
    } catch (e) {
      Logger.error('Error while fetching posts: ', e);
      throw new InternalServerErrorException(
        'Server error',
        'Error while fetching posts',
      );
    }
  }

  async getAssetById(assetIndex: string) {
    const env: string = process.env.ENV;
    const indexer_server = this.configService.get<string>(
      `${env}.ALGO_INDEXER_SERVER_TEST`,
    )
      ? this.configService.get<string>(`${env}.ALGO_INDEXER_SERVER_TEST`)
      : process.env.ALGO_INDEXER_SERVER_TEST;
    const indexer_port = '';
    const indexer_token = {
      'X-API-Key': this.configService.get<string>(`${env}.PURESTAKE_KEY`)
        ? this.configService.get<string>(`${env}.PURESTAKE_KEY`)
        : process.env.PURESTAKE_KEY,
    };

    const indexerClient = new algosdk.Indexer(
      indexer_token,
      indexer_server,
      indexer_port,
    );

    try {
      let assetInfo = await indexerClient
        .searchForAssets()
        .index(parseInt(assetIndex))
        .do();
      console.debug(assetInfo.assets);
      return assetInfo.assets;
    } catch (error) {
      console.log(error);
    }
  }

  async getOwnerAddress(id) {
    const user = await this.userModel.findById(id).exec();
    return user.address;
  }

  async waitForConfirmation(algodclient, txId) {
    let response = await algodclient.status().do();
    let lastround = response['last-round'];
    while (true) {
      const pendingInfo = await algodclient
        .pendingTransactionInformation(txId)
        .do();
      if (
        pendingInfo['confirmed-round'] !== null &&
        pendingInfo['confirmed-round'] > 0
      ) {
        //Got the completed Transaction
        console.debug(
          'Transaction ' +
            txId +
            ' confirmed in round ' +
            pendingInfo['confirmed-round'],
        );
        break;
      }
      lastround++;
      await algodclient.statusAfterBlock(lastround).do();
    }
  }

  getARC69(description, mime_type, properties) {
    let normal = {
      standard: 'arc69',
      description: description,
      mime_type: mime_type,
      properties: JSON.parse(properties),
    };
    return normal;
  }

  async mintNFT(
    count: number,
    filename: string,
    assetURL: string,
    description: string,
    mime_type: string,
    properties: any,
    account_mnemonic: string,
  ) {
    const UNIT_PREFIX = 'AX-';
    const ASSET_PREFIX = 'AlgoSo';
    const env: string = process.env.ENV;
    const server = this.configService.get<string>(`${env}.ALGO_SERVER_TEST`)
      ? this.configService.get<string>(`${env}.ALGO_SERVER_TEST`)
      : process.env.ALGO_SERVER_TEST;
    const port = '';
    const token = {
      'X-API-Key': this.configService.get<string>(`${env}.PURESTAKE_KEY`)
        ? this.configService.get<string>(`${env}.PURESTAKE_KEY`)
        : process.env.PURESTAKE_KEY,
    };

    let algodclient = new algosdk.Algodv2(token, server, port);
    var account = algosdk.mnemonicToSecretKey(account_mnemonic);
    let accountInfo = await algodclient.accountInformation(account.addr).do();
    console.debug('Account balance: %d microAlgos', accountInfo.amount);

    let params = await algodclient.getTransactionParams().do();
    var enc = new TextEncoder();
    let note = enc.encode(
      JSON.stringify(this.getARC69(description, mime_type, properties)),
    );
    let addr = account.addr;
    let defaultFrozen = false;
    let decimals = 0;
    let totalIssuance = 1;
    let unitName = `${UNIT_PREFIX}${count}`;
    let assetName = `${ASSET_PREFIX}`;
    let assetMetadataHash = undefined;
    let manager = account.addr;
    let reserve = account.addr;
    let freeze = undefined;
    let clawback = undefined;

    let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
      addr,
      note,
      totalIssuance,
      decimals,
      defaultFrozen,
      manager,
      reserve,
      freeze,
      clawback,
      unitName,
      assetName,
      assetURL,
      assetMetadataHash,
      params,
    );

    console.debug(`Minting ${assetName} (${unitName}) from ${filename}...`);
    let rawSignedTxn = txn.signTxn(account.sk);
    let tx = await algodclient.sendRawTransaction(rawSignedTxn).do();
    let assetID = null;
    // wait for transaction to be confirmed
    await this.waitForConfirmation(algodclient, tx.txId);
    // Get the new asset's information from the creator account
    let ptx = await algodclient.pendingTransactionInformation(tx.txId).do();
    assetID = ptx['asset-index'];
    return assetID;
  }

  async checkUserPublishedPost(address: string) {
    const user = await this.userModel.find({
      address: address,
    });
    if (user) {
      const posts = await this.postModel.find({ owner: user[0]._id });
      if (posts.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  async transfer(
    postId: string,
    mnemonic: string,
    senderAddr: string,
    recipientAddr: string,
  ) {
    try {
      const post = await this.postModel.findById(postId);
      if (post) {
        const res: any = await this.transaction(
          parseInt(post.assetId),
          post.account_mnemonic,
          senderAddr,
          recipientAddr,
        );
        const user = await this.userModel.find({
          address: recipientAddr,
        });
        const newPost = await this.postModel
          .findByIdAndUpdate(
            postId,
            {
              owner: user[0]._id,
              account_mnemonic: mnemonic,
            },
            { new: true },
          )
          .exec();
        return newPost;
      }
    } catch (error) {
      console.debug(error);
    }
  }

  async transaction(
    assetIDParam: number,
    account_mnemonic: string,
    senderAddr: string,
    recipientAddr: string,
  ) {
    // Transfer Asset:
    try {
      let assetID = assetIDParam;
      let sender = senderAddr;
      let recipient = recipientAddr;
      let note = undefined;
      // We set revocationTarget to undefined as
      // This is not a clawback operation
      let revocationTarget = undefined;
      // CloseReaminerTo is set to undefined as
      // we are not closing out an asset
      let closeRemainderTo = undefined;
      // We are sending 1 assets
      let amount = 1;

      var account = algosdk.mnemonicToSecretKey(account_mnemonic);

      const env: string = process.env.ENV;
      const server = this.configService.get<string>(`${env}.ALGO_SERVER_TEST`)
        ? this.configService.get<string>(`${env}.ALGO_SERVER_TEST`)
        : process.env.ALGO_SERVER_TEST;
      const port = '';
      const token = {
        'X-API-Key': this.configService.get<string>(`${env}.PURESTAKE_KEY`)
          ? this.configService.get<string>(`${env}.PURESTAKE_KEY`)
          : process.env.PURESTAKE_KEY,
      };
      let algodclient = new algosdk.Algodv2(token, server, port);

      let params = await algodclient.getTransactionParams().do();

      revocationTarget = undefined;
      closeRemainderTo = undefined;
      //Amount of the asset to transfer
      amount = 1;

      // signing and sending "txn" will send "amount" assets from "sender" to "recipient"
      let xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        recipient,
        closeRemainderTo,
        revocationTarget,
        amount,
        note,
        assetID,
        params,
      );
      // Must be signed by the account sending the asset
      let rawSignedTxn = xtxn.signTxn(account.sk);
      let xtx = await algodclient.sendRawTransaction(rawSignedTxn).do();

      // wait for transaction to be confirmed
      await this.waitForConfirmation(algodclient, xtx.txId);
      let ptx = await algodclient.pendingTransactionInformation(xtx.txId).do();

      // Modifying current asset
      let clawback = undefined;

      let xtxn2 = algosdk.makeAssetConfigTxnWithSuggestedParams(
        sender,
        note,
        assetID,
        recipient,
        recipient,
        recipient,
        clawback,
        params,
        false,
      );
      // Must be signed by the account sending the asset
      let rawSignedTxn2 = xtxn2.signTxn(account.sk);
      let xtx2 = await algodclient.sendRawTransaction(rawSignedTxn2).do();

      // wait for transaction to be confirmed
      await this.waitForConfirmation(algodclient, xtx2.txId);
      let ptx2 = await algodclient
        .pendingTransactionInformation(xtx2.txId)
        .do();

      assetID = ptx['asset-index'];
      return assetID;
    } catch (e) {
      console.debug(e);
    }
  }
}
