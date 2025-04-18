import React from 'react';
import { PayPalButton } from 'react-paypal-button-v2';

function PayPalButtonComponent() {
  const handleSuccessfulPayment = (details, data) => {
    console.log('PayPal payment successful!', details, data);
    // Here you would typically:
    // 1. Send payment details to your server to verify and update membership status.
    // 2. Show a success message to the user.
    alert('Payment successful! Thank you for becoming a member.');
  };

  const handleCancelPayment = (data) => {
    console.log('PayPal payment cancelled!', data);
    // Handle cancelled payment if needed
    alert('Payment cancelled.');
  };

  const handleError = (err) => {
    console.error('PayPal error!', err);
    // Handle error appropriately
    alert('An error occurred during payment. Please try again.');
  };

  return (
    <PayPalButton
      amount="20.00" // Set your membership price here
      currency="CAD" // Set your currency
      onSuccess={handleSuccessfulPayment}
      onError={handleError}
      onCancel={handleCancelPayment}
      options={{
        clientId: 'YOUR_PAYPAL_CLIENT_ID' // Replace with your actual PayPal Client ID
      }}
    />
  );
}

export default PayPalButtonComponent;
