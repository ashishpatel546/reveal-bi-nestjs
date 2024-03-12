import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  private get(key: string): string {
    const value = this.configService.get(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }
    return value;
  }

  private getString(key: string): string {
    return this.get(key).trim();
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return parseInt(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get apiVersion(): string {
    return this.getString('API_VERSION');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get getFromTimeStamp(): string {
    return this.get('FROM_TIMESTAMP');
  }

  get getFromTimeStampForCsd(): string {
    return this.get('FROM_TIMESTAMP_CSD');
  }

  get getFromTimeStampForChargerUtilization(): string {
    return this.get('FROM_TIMESTAMP_CHARGER_UTILIZATION');
  }

  get getFromTimeStampForChargerUptime(): string {
    return this.get('FROM_TIMESTAMP_CHARGER_UPTIME');
  }
  get getFromTimeStampForChargerUsage(): string {
    return this.get('FROM_TIMESTAMP_CHARGER_USAGE');
  }

  get getFromTimeStampForBillingReconciliation(): string {
    return this.get('FROM_TIMESTAMP_BILLING_RECONCILIATION');
  }

  get getFromTimeStampForFleetAuthorization(): string {
    return this.get('FROM_TIMESTAMP_FLEET_AUTHORIZATION');
  }

  get getFromTimeStampForUserMembershipStatus(): string {
    return this.get('FROM_TIMESTAMP_USER_DETAILS');
  }

  get getFromTimeStampForCharger(): string {
    return this.get('FROM_TIMESTAMP_DEPLOYED_CHARGER');
  }

  get getFromTimeStampForLocation(): string {
    return this.get('FROM_TIMESTAMP_LOCATION');
  }

  get isSyncronization(): boolean {
    return this.getBoolean('IS_SYNCRONIZATION');
  }

  get getFromTimeStampForFleetAlert(): string {
    return this.get('FROM_TIMESTAMP_FLEET_ALERT');
  }

  get getFromTimeStampForRfidRequest(): string {
    return this.get('FROM_TIMESTAMP_RFID_REQUEST');
  }

  get getFromTimeStampForChargerData(): string {
    return this.get('FROM_TIMESTAMP_CHARGER');
  }

  get getFromTimeStampForUserStatement(): string {
    return this.get('FROM_TIMESTAMP_USER_STATEMENT');
  }

  get isCronEnabled(): boolean {
    return this.getBoolean('CRON_ENABLED');
  }

  get isFleetAlertCronEnabled(): boolean {
    return this.getBoolean('FLEET_ALERT_CRON_ENABLED');
  }

  get isRfidRequestCronEnabled(): boolean {
    return this.getBoolean('RFID_REQUEST_CRON_ENABLED');
  }

  get isChargingSessionCronEnabled(): boolean {
    return this.getBoolean('CHARGING_SESSION_CRON_ENABLED');
  }

  get isChargerUptimeCronEnabled(): boolean {
    return this.getBoolean('CHARGER_UPTIME_CRON_ENABLED');
  }

  get isBillingReconciliationCronEnabled(): boolean {
    return this.getBoolean('BILLING_RECONCILIATION_CRON_ENABLED');
  }

  get isFleetAuthorizationCronEnabled(): boolean {
    return this.getBoolean('FLEET_AUTHORIZATION_CRON_ENABLED');
  }

  get isUserMembershipStatusCroneEnabled(): boolean {
    return this.getBoolean('USER_DETAILS_CRON_ENABLED');
  }

  get isDeployedChargerCronEnabled(): boolean {
    return this.getBoolean('DEPLOYED_CHARGER_CRON_ENABLED');
  }

  get isChargerTrendCronEnabled(): boolean {
    return this.getBoolean('CHARGER_TREND_CRON_ENABLED');
  }

  get isChargerUtilizationCronEnabled(): boolean {
    return this.getBoolean('CHARGER_UTILIZATION_CRON_ENABLED');
  }

  get isChargerUsageCronEnabled(): boolean {
    return this.getBoolean('CHARGER_USAGE_CRON_ENABLED');
  }

  get isChargingSessionDetailsCronEnabled(): boolean {
    return this.getBoolean('CHARGING_SESSION_DETAILS_CRON_ENABLED');
  }

  get isUserStatementCronEnabled(): boolean {
    return this.getBoolean('USER_STATEMENT_CRON_ENABLED');
  }

  get isChargerCronEnabled(): boolean {
    return this.getBoolean('CHARGER_CRON_ENABLED');
  }
  get isLocationCronEnabled(): boolean {
    return this.getBoolean('LOCATION_CRON_ENABLED');
  }

  get isManualEnabled(): boolean {
    return this.getBoolean('MANNUAL_UPDATION_ALLOWED');
  }

  get getBatchSize(): number {
    return this.getNumber('BATCH_SIZE');
  }

  get getCsdBatchSize(): number {
    return this.getNumber('CSD_BATCH_SIZE');
  }

  get getWriteBatchSize(): number {
    return this.getNumber('WRITE_BATCH_SIZE');
  }

  get getChargerUpTimeSlice(): number {
    return this.getNumber('CHARGER_UP_TIME_SLICING');
  }

  get getChargerBatchSize(): number {
    return this.getNumber('CHARGER_BATCH_SIZE');
  }

  get getThrottleTTL(): number {
    return this.getNumber('THROTTLE_TTL');
  }

  get getThrottleLimit(): number {
    return this.getNumber('THROTTLE_LIMIT');
  }

  get appConfig(): { port: number } {
    return {
      port: this.getNumber('SERVICE_PORT'),
    };
  }
}
