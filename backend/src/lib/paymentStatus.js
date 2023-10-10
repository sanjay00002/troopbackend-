const sdk = require('api')('@cashfreedocs-new/v3#173cym2vlivg07d0');
export async function getPaymentStatus(linkId){
    try {
        sdk.server('https://sandbox.cashfree.com/pg');
        const { data } = await sdk.getPaymentLinkOrders({
          link_id: linkId,
          'x-client-id': 'TEST40437759704009880a29007d61773404',
          'x-client-secret': 'TEST95536982c0ad8e1ed3febb0de32ed675c6c0236',
          'x-api-version': '2022-09-01'
        });
    
        
        if (data[0] && data[0].order_status === 'PAID') {
            const res ={
                status: true,
                amount: data[0].order_amount
            }
          return res;
        } else {
            const res ={
                status: false,
            }
            return res;
        }
      } catch (error) {
        console.error(error);
        throw error; // or handle the error as needed
      }
}