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