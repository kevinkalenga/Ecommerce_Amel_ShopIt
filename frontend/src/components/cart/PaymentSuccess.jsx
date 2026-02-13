import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/features/cartSlice";

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Déclare sessionId ici pour pouvoir l'utiliser dans le JSX
  const sessionId = new URLSearchParams(window.location.search).get("session_id");

  useEffect(() => {
    // Vider le panier Redux et localStorage
    dispatch(clearCart());
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingInfo");

    // Redirection vers la page des commandes après 1.5s
    const timer = setTimeout(() => {
      navigate("/me/orders");
    }, 1500);

    return () => clearTimeout(timer);
  }, [dispatch, navigate]); // sessionId n'a pas besoin d'être dans le useEffect

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2> Confirmed Payment</h2>
      <p>Redirect to the dashboard orders...</p>
      {sessionId && (
        <p style={{ fontSize: "0.9rem", color: "#555" }}>
          Stripe Session: {sessionId}
        </p>
      )}
    </div>
  );
};

export default PaymentSuccess;
