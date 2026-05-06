import { MigrationInterface, QueryRunner } from "typeorm";

export class NullabelcarrierNameandtrackingNumber1778064520014 implements MigrationInterface {
    name = 'NullabelcarrierNameandtrackingNumber1778064520014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "outbound" ALTER COLUMN "carrier_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "outbound" ALTER COLUMN "tracking_number" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "outbound" ALTER COLUMN "tracking_number" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "outbound" ALTER COLUMN "carrier_name" SET NOT NULL`);
    }

}
