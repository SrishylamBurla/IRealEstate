export const baseTemplate = ({ title, body, ctaText, ctaLink }) => `
<div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px">
  <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden">

    <!-- HEADER -->
    <div style="background:#2563eb;color:white;padding:16px;text-align:center">
      <h1 style="margin:0">iRealEstate</h1>
      <p style="margin:4px 0 0;font-size:14px">Property Management Platform</p>
    </div>

    <!-- BODY -->
    <div style="padding:20px;color:#333">
      <h2>${title}</h2>
      <p>${body}</p>

      ${
        ctaLink
          ? `<a href="${ctaLink}" 
              style="display:inline-block;margin-top:16px;
                     background:#2563eb;color:white;
                     padding:10px 16px;
                     text-decoration:none;
                     border-radius:4px">
                ${ctaText}
             </a>`
          : ""
      }
    </div>

    <!-- FOOTER -->
    <div style="background:#f1f5f9;padding:12px;text-align:center;font-size:12px;color:#666">
      © ${new Date().getFullYear()} iRealEstate. All rights reserved.
    </div>
  </div>
</div>
`;
