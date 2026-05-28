import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { GithubModule } from './github/github.module';
import { StatsModule } from './stats/stats.module';
import { QueueModule } from './queue/queue.module';
import { BullModule } from '@nestjs/bullmq'
import { WrappedModule } from './wrapped/wrapped.module';
import { WrappedDataModule } from './wrapped-data/wrapped-data.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432', 10) || 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User],
      autoLoadEntities: true,
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: (parseInt(process.env.JWT_EXPIRES_IN || '7') || 7) * 1000 * 60 * 60 * 24 },
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(
          process.env.REDIS_PORT || '6379'
        )
      }
    }),
    AuthModule,
    GithubModule,
    StatsModule,
    QueueModule,
    WrappedModule,
    WrappedDataModule,
    CommentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
