/**
 * Notification Service
 * Handles booking notifications to partners
 * Currently logs to console - can be replaced with real email service (SendGrid, etc.)
 */

export interface BookingNotification {
  partnerName: string;
  partnerEmail?: string;
  customerName: string;
  ticketType: 'Solo' | 'Duo';
  amount: number;
  sessionDate?: string;
  bookingId: string;
}

/**
 * Send booking notification to partner
 * @param notification - The booking notification details
 */
export async function sendPartnerNotification(notification: BookingNotification): Promise<void> {
  const {
    partnerName,
    partnerEmail,
    customerName,
    ticketType,
    amount,
    sessionDate,
    bookingId,
  } = notification;

  // Log notification (replace with actual email service in production)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 NOTIFICATION DE RÉSERVATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Partenaire: ${partnerName}`);
  if (partnerEmail) {
    console.log(`📧 Email: ${partnerEmail}`);
  }
  console.log(`👤 Client: ${customerName}`);
  console.log(`🎟️ Type: ${ticketType} (${ticketType === 'Duo' ? '2 places' : '1 place'})`);
  console.log(`💰 Montant: ${amount}€`);
  if (sessionDate) {
    console.log(`📅 Date: ${sessionDate}`);
  }
  console.log(`🔢 Réservation ID: ${bookingId}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // TODO: Replace with actual email service
  // Example with SendGrid:
  // await sendgrid.send({
  //   to: partnerEmail,
  //   from: 'noreply@spordateur.com',
  //   subject: `Nouvelle réservation ${ticketType} - ${customerName}`,
  //   html: `...`,
  // });

  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Send booking confirmation to customer
 * @param customerEmail - Customer email address
 * @param bookingDetails - Booking details
 */
export async function sendCustomerConfirmation(
  customerEmail: string,
  bookingDetails: {
    profileName: string;
    partnerName: string;
    ticketType: 'Solo' | 'Duo';
    amount: number;
    bookingId: string;
  }
): Promise<void> {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 CONFIRMATION CLIENT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📧 À: ${customerEmail}`);
  console.log(`🏋️ Séance avec: ${bookingDetails.profileName}`);
  console.log(`📍 Lieu: ${bookingDetails.partnerName}`);
  console.log(`🎟️ Ticket: ${bookingDetails.ticketType}`);
  console.log(`💰 Montant: ${bookingDetails.amount}€`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await new Promise(resolve => setTimeout(resolve, 100));
}
