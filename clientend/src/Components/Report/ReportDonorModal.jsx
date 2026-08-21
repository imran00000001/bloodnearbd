import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import usePublicAxios from "../../hooks/usePublicAxios";

const image_hosting = import.meta.env.VITE_IMAGE_HOST;
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting}`;

const ReportDonorModal = ({ donor }) => {
  const { user } = useAuth();
  const axiosPublic = usePublicAxios();

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setReason("");
    setPhotoFile(null);
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Swal.fire({ icon: "warning", title: "কারণ লিখুন", text: "রিপোর্টের কারণ ছাড়া জমা দেওয়া যাবে না।" });
      return;
    }
    if (!user?.email) {
      Swal.fire({ icon: "warning", title: "লগইন করুন", text: "রিপোর্ট করতে হলে আগে লগইন করতে হবে।" });
      return;
    }

    setSubmitting(true);
    try {
      let photoUrl = "";

      if (photoFile) {
        const formData = new FormData();
        formData.append("image", photoFile);
        const res = await fetch(img_hosting_api, { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          photoUrl = data.data.display_url;
        }
      }

      await axiosPublic.post("/reports", {
        reporterName: user?.displayName,
        reporterEmail: user?.email,
        donorEmail: donor?.email,
        donorName: donor?.name,
        reason,
        photoUrl,
      });

      Swal.fire({ icon: "success", title: "রিপোর্ট জমা হয়েছে", text: "Admin এটা রিভিউ করবেন।" });
      handleClose();
    } catch (err) {
      Swal.fire({ icon: "error", title: "সমস্যা হয়েছে", text: err.message });
    }
    setSubmitting(false);
  };

  return (
    <>
      <Button
        size="small"
        onClick={() => setOpen(true)}
        sx={{ color: "#7A1128", textTransform: "none", fontSize: "12px" }}
      >
        ⚠ Report
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>এই ডোনারের বিরুদ্ধে রিপোর্ট করুন</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-2">
          <TextField
            label="সমস্যার কারণ লিখুন"
            multiline
            minRows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
          />
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              প্রমাণ ছবি (ঐচ্ছিক)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files[0])}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>বাতিল</Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            variant="contained"
            sx={{ bgcolor: "#7A1128" }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : "জমা দিন"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReportDonorModal;
