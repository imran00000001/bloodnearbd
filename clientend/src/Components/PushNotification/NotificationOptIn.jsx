import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { NotificationsActive, NotificationsOff } from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
import usePublicAxios from "../../hooks/usePublicAxios";

// converts the VAPID public key (base64) into the Uint8Array format
// the browser's PushManager API expects
const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const NotificationOptIn = () => {
  const { user } = useAuth();
  const axiosPublic = usePublicAxios();
  const [status, setStatus] = useState("checking"); // checking | unsupported | denied | subscribed | unsubscribed
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        setStatus("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      const existingSub = await reg.pushManager.getSubscription();
      setStatus(existingSub ? "subscribed" : "unsubscribed");
    };
    checkStatus();
  }, []);

  const handleSubscribe = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        setLoading(false);
        return;
      }

      const { data } = await axiosPublic.get("/push/vapidPublicKey");
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(data.publicKey),
      });

      await axiosPublic.post("/push/subscribe", {
        email: user.email,
        subscription,
      });

      setStatus("subscribed");
    } catch (err) {
      console.error("Push subscribe failed:", err);
    }
    setLoading(false);
  };

  const handleUnsubscribe = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      const existingSub = await reg.pushManager.getSubscription();
      if (existingSub) {
        await axiosPublic.post("/push/unsubscribe", {
          email: user.email,
          endpoint: existingSub.endpoint,
        });
        await existingSub.unsubscribe();
      }
      setStatus("unsubscribed");
    } catch (err) {
      console.error("Push unsubscribe failed:", err);
    }
    setLoading(false);
  };

  if (status === "checking") return null;

  if (status === "unsupported") {
    return (
      <p className="text-sm text-gray-500">
        আপনার ব্রাউজার push notification সাপোর্ট করে না।
      </p>
    );
  }

  if (status === "denied") {
    return (
      <p className="text-sm text-gray-500">
        আপনি notification permission বন্ধ করে রেখেছেন। ব্রাউজারের সেটিংস থেকে চালু করুন।
      </p>
    );
  }

  return status === "subscribed" ? (
    <Button
      onClick={handleUnsubscribe}
      disabled={loading}
      startIcon={<NotificationsActive />}
      variant="outlined"
      sx={{ borderColor: "#7A1128", color: "#7A1128" }}
    >
      নোটিফিকেশন চালু আছে (বন্ধ করুন)
    </Button>
  ) : (
    <Button
      onClick={handleSubscribe}
      disabled={loading}
      startIcon={<NotificationsOff />}
      variant="contained"
      sx={{ bgcolor: "#7A1128", "&:hover": { bgcolor: "#4A0A18" } }}
    >
      কাছাকাছি রক্তের প্রয়োজন হলে জানাও (Notification চালু করুন)
    </Button>
  );
};

export default NotificationOptIn;
