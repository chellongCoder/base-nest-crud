import { Module, MiddlewareConsumer, RequestMethod, NestModule } from '@nestjs/common';
import { JwtStrategy } from './security/jwt.strategy';
import { AuthGuard } from './security/guards/auth.guards';
import { FunctionalExceptionFilter } from './common/exception/function-exception.filter';
import { TechnicalExceptionFilter } from './common/exception/technical-exception.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthMiddleware } from './security/auth.middleware';
import { AuthService } from './security/auth.service';
import { RoutesModule } from './routes/routes.modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { Connection } from 'typeorm';

@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'test',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
  }), RoutesModule, UsersModule],
  controllers: [],
  providers: [AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: FunctionalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: TechnicalExceptionFilter,
    }],
})
export class AppModule implements NestModule {
  constructor(private connection: Connection) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*', method: RequestMethod.ALL,
    });
  }
}