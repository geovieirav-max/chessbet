export async function POST(req) {
  try {
    const { amount, currency, userId } = await req.json();

    const response = await fetch('https://api.nowpayments.io/v1/payment', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: amount,
        price_currency: 'usd',
        pay_currency: currency || 'usdttrc20',
        order_id: `chess_${userId}_${Date.now()}`,
        order_description: 'Deposito para jogo de Xadrez',
        ipn_callback_url: 'https://chessbet-ten.vercel.app/api/nowpayments-webhook',
      }),
    });

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
