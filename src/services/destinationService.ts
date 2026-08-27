import 'dotenv/config';
import fetch from 'node-fetch';
import type { CountryInfo } from '../models.ts';

// Service to get the country-information from the REST Countries API
export const getDestinationInfo = async (countryName: string): Promise<CountryInfo> => {
    try {
        const bearerToken = process.env.RESTCOUNTRIES_BEARER;

        if (!bearerToken) {
            throw new Error('Missing RESTCOUNTRIES_BEARER in environment variables');
        }

        const response = await fetch(
            `https://api.restcountries.com/countries/v5?q=${encodeURIComponent(countryName)}`,
            { headers: { Authorization: `Bearer ${bearerToken}` } }
        );

        if (!response.ok) {
            throw new Error(`REST Countries request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const country = data?.data?.objects?.[0];
        const currency = country?.currencies?.[0]?.code;
        const flagPng = country?.flag?.url_png;

        if (!country || !currency || !flagPng) {
            throw new Error('Country data is missing');
        }

        return {
            currency,
            flag: flagPng
        };
    } catch (error: unknown) {
        throw new Error('Could not fetch country data', { cause: error });
    }
};

