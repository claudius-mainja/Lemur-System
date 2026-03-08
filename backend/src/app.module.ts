import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheModule } from '@nestjs/cache-manager';

import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { HrModule } from './hr/hr.module';
import { FinanceModule } from './finance/finance.module';
import { CrmModule } from './crm/crm.module';
import { PayrollModule } from './payroll/payroll.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseType = configService.get('DATABASE_TYPE') || 'postgres';
        
        if (databaseType === 'postgres') {
          return {
            type: 'postgres',
            host: configService.get('DATABASE_HOST') || 'localhost',
            port: parseInt(configService.get('DATABASE_PORT') || '5432'),
            username: configService.get('DATABASE_USERNAME') || 'erpuser',
            password: configService.get('DATABASE_PASSWORD') || 'erppassword',
            database: configService.get('DATABASE_DATABASE') || 'erp',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: configService.get('NODE_ENV') !== 'production',
            logging: configService.get('NODE_ENV') === 'development',
          };
        }
        
        return {
          type: 'sqljs',
          autoSave: true,
          location: configService.get('DATABASE_PATH') || 'lemursystem.db',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
    }),

    CacheModule.register({
      isGlobal: true,
      ttl: 300,
    }),

    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),

    ScheduleModule.forRoot(),

    EventEmitterModule.forRoot(),

    AuthModule,
    TenantsModule,
    HrModule,
    FinanceModule,
    CrmModule,
    PayrollModule,
    EmailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
