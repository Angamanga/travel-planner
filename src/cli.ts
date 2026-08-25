import { getDestinationInfo } from './services/destinationService.js';

export async function main() {
    const destinationInfo = await getDestinationInfo('Norway');
    console.log('Destination info about Norway fetched successfully');
    console.log(destinationInfo);
}

main();