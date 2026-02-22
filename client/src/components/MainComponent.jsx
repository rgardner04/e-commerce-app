import { Routes, Route } from "react-router";
import PrivateComponent from "./PrivateComponent";
import AuthComponent from "../auth/components/AuthComponent";
import VerificationComponent from "../auth/components/VerificationComponent";
import SearchComponent from "../search/components/SearchComponent";

export default function MainComponent() {
  return (
    <main className="main">
      <Routes>
        <Route path="auth" element={<AuthComponent />} />
        <Route path="auth/verification" element={<VerificationComponent />} />
        <Route
          path="/"
          element={
            <PrivateComponent>
              <SearchComponent />
            </PrivateComponent>
          }
        />
      </Routes>
    </main>
  );
}
