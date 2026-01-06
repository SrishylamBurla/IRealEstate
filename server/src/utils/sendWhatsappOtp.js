import axios from "axios";

export const sendWhatsappOtp = async ({ phone, otp }) => {
  const url = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to: phone, // with country code e.g. 91703618XXXX
    type: "template",
    template: {
      name: "login_otp",
      language: { code: "en_US" },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: otp,
            },
          ],
        },
      ],
    },
  };

  await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
};
