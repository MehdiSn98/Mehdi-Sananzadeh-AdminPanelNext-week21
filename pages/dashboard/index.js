import { ProductProvider } from "../../contexts/ProductContext";
import DashboardInner from "../../components/DashboardInner";

export default function DashboardPage() {
  return (
    <ProductProvider>
      <DashboardInner />
    </ProductProvider>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies?.token;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
    const user = JSON.parse(jsonPayload);

    return {
      props: {
        user,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}
