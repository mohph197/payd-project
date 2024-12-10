<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $countries = [
            ['code' => 'AE', 'name' => 'United Arab Emirates', 'phone_code' => '+971', 'currency_code' => 'AED'],
            ['code' => 'US', 'name' => 'United States', 'phone_code' => '+1', 'currency_code' => 'USD'],
            ['code' => 'FR', 'name' => 'France', 'phone_code' => '+33', 'currency_code' => 'EUR'],
            ['code' => 'DZ', 'name' => 'Algeria', 'phone_code' => '+213', 'currency_code' => 'DZD'],
            ['code' => 'GB', 'name' => 'United Kingdom', 'phone_code' => '+44', 'currency_code' => 'GBP'],
            ['code' => 'RU', 'name' => 'Russia', 'phone_code' => '+7', 'currency_code' => 'RUB'],
        ];

        DB::table('countries')->insert($countries);
    }
}
