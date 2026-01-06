export const approvalEmail = (property) => `
  <h2>✅ Property Approved</h2>
  <p>Your property <b>${property.title}</b> has been approved.</p>
  <p>It is now live on the platform.</p>
`;

export const rejectionEmail = (property, reason) => `
  <h2>❌ Property Rejected</h2>
  <p>Your property <b>${property.title}</b> was rejected.</p>
  <p><b>Reason:</b> ${reason}</p>
  <p>You can edit and resubmit the property.</p>
`;

export const undoRejectEmail = (property) => `
  <h2>🔁 Property Reopened</h2>
  <p>Your property <b>${property.title}</b> is back under review.</p>
`;

export const resetPasswordEmail = (name, url) => `
<div style="font-family:Arial; max-width:600px; margin:auto">
  <h2 style="color:#1e3a8a">iRealEstate</h2>
  <p>Hello ${name},</p>
  <p>You requested to reset your password.</p>

  <a href="${url}" style="
    display:inline-block;
    background:#1e40af;
    color:white;
    padding:12px 20px;
    text-decoration:none;
    border-radius:6px;
    margin:16px 0;
  ">
    Reset Password
  </a>

  <p style="font-size:12px;color:#666">
    This link expires in 15 minutes.
  </p>
</div>
`;
