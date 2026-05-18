import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddMinMaxStockToInventory1779069000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('inventory', new TableColumn({
            name: 'min_stock',
            type: 'int',
            default: 0,
            isNullable: false,
        }));

        await queryRunner.addColumn('inventory', new TableColumn({
            name: 'max_stock',
            type: 'int',
            default: 0,
            isNullable: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('inventory', 'max_stock');
        await queryRunner.dropColumn('inventory', 'min_stock');
    }
}
