import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class ChargingSessionGraphDataProiver {
    constructor(
        @InjectDataSource('Redshift') private readonly redshift: DataSource
    ){}

    private getHostRevenueByDay(){

    }
}