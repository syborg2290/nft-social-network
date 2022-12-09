import { Module } from "@nestjs/common";
import { databaseProviders } from "./providers/database.providers";
import { ConfigService } from "@nestjs/config";

@Module({
  providers: [ConfigService, ...databaseProviders],
  exports: [ConfigService, ...databaseProviders],
})
export class DatabaseModule {}
