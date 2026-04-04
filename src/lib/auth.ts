import { headers } from 'next/headers';

export async function getCompanyId() {
    const headersList = await headers();
    const companyIdStr = headersList.get('x-company-id');
    
    if (!companyIdStr) return null;
    
    const id = parseInt(companyIdStr);
    return isNaN(id) ? null : id;
}
