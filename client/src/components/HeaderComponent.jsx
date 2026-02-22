import { useAuthContext } from "../contexts/AuthContext";
import { ShoppingBag, ShoppingCart, User, Menu } from "lucide-react";
import "../styles/HeaderComponent.css";

export default function HeaderComponent() {
  const { state } = useAuthContext();

  if (state?.accessToken && state?.refreshToken) {
    return (
      <header>
        <nav>
          <div className="header-brand-container">
            <ShoppingBag className="header-brand-icon" size={20} />
            <h1>ShopFlow</h1>
          </div>
          <ShoppingCart className="header-icon" size={16} cursor={"pointer"} />
          <User className="header-icon" size={16} cursor={"pointer"} />
          <Menu className="header-icon" size={16} cursor={"pointer"} />
        </nav>
      </header>
    );
  } else {
    return null;
  }
}
