import { LockOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { Link, useLocation, useNavigate } from "react-router-dom";

import useDistricts from "../../hooks/useDistricts";
import Option from "../../Components/Option/Option";
import OptionAll from "../../Components/Option/OptionAll";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import usePublicAxios from "../../hooks/usePublicAxios";
import Swal from "sweetalert2";

const image_hosting = import.meta.env.VITE_IMAGE_HOST;
const img_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting}`;

const SignUp = () => {
  const [districts, handleDistricts, upuzzila] = useDistricts();
  const { createUser, updateUser, logOut, verifyEmail, signIn } = useAuth();
  const [profileImage, setProfileImage] = useState(
    "https://www.thedivorceangels.com/wp-content/themes/divorceangels/images/avatars/default-8.png"
  );
  const [profilePreview, setProfilePreview] = useState("");
  const [profileUploading, setProfileUploading] = useState(false);
  const axiosPublic = usePublicAxios();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const bloodGroup = [
    { id: 1, name: "A+" },
    { id: 2, name: "A-" },
    { id: 3, name: "B+" },
    { id: 4, name: "B-" },
    { id: 5, name: "AB+" },
    { id: 6, name: "AB-" },
    { id: 7, name: "O+" },
    { id: 8, name: "O-" },
  ];

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePreview(URL.createObjectURL(file));
      setProfileUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(img_hosting_api, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const { display_url } = data.data;
          setProfileImage(display_url);
        } else {
          Swal.fire({ icon: "error", title: "ছবি আপলোড হয়নি", text: "আবার চেষ্টা করুন, বা অন্য একটা ছবি দিয়ে দেখুন।" });
          setProfilePreview("");
        }
      } catch (error) {
        Swal.fire({ icon: "error", title: "ছবি আপলোড হয়নি", text: error.message });
        setProfilePreview("");
      }
      setProfileUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const photo = profileImage;
    const email = data.get("email");
    const password = data.get("password");
    const name = data.get("name");
    const phone = data.get("phone");
    const blood = data.get("blood");
    const districts = data.get("distrits");
    const upuzilla = data.get("upuzilla");
    if (email === "") {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Please Provide Email ID`,
        showConfirmButton: false,
        timer: 1500,
      });

      return;
    }
    if (name === "") {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Please Provide Name`,
        showConfirmButton: false,
        timer: 1500,
      });

      return;
    } else if (password === "" || password.length < 6) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Password must be six digit`,
        showConfirmButton: false,
        timer: 1500,
      });

      return;
    } else if (blood === "") {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Please Select blood group`,
        showConfirmButton: false,
        timer: 1500,
      });

      return;
    } else if (districts === "") {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Please Select your district`,
        showConfirmButton: false,
        timer: 1500,
      });

      return;
    } else if (upuzilla === "") {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Please select your upuzila`,
        showConfirmButton: false,
        timer: 1500,
      });

      return;
    }

    const defaultCoverImg =
      "https://images.pexels.com/photos/12227661/pexels-photo-12227661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

    const userInfo = {
      name: name,
      phone: phone,
      profileImg: photo,
      coverImg: defaultCoverImg,
      email: email,
      blood: blood,
      districts: districts,
      upuzilla: upuzilla,
      role: "Guest",
      roleStatus: "no request",
      status: "Active",
    };

    // Creates the DB record for this user and shows the success message.
    // Pulled out so both the "fresh signup" path and the "resume an
    // interrupted signup" path below can call the exact same finishing step.
    const finishRegistration = async () => {
      const res = await axiosPublic.post("/user", userInfo);
      if (res?.data?.insertedId) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: `Registration Successful`,
          text: "একটা verification link আপনার ইমেইলে পাঠানো হয়েছে, দয়া করে চেক করুন।",
          showConfirmButton: false,
          timer: 2500,
        });
        navigate(from, { replace: true });
      } else {
        // insertedId is null -> the DB already has this email (e.g. a
        // previous attempt's DB write actually went through). Nothing more
        // to create; just take them onward like a normal successful signup.
        navigate(from, { replace: true });
      }
    };

    try {
      // Step 1: create the Firebase Auth account, and only move on once
      // this has actually succeeded — this is the fix for the race
      // condition (previously the DB write below fired regardless of
      // whether this step succeeded, which is how "ghost" DB records with
      // no matching working login were created on a slow/dropped connection).
      const result = await createUser(email, password);
      await updateUser(name, photo);

      // Send a real verification link. If this single email fails to send
      // (e.g. flaky network) we don't block registration for it — the user
      // can request a new one later — but everything else must still finish.
      verifyEmail().catch((err) => {
        console.warn("Could not send verification email:", err.message);
      });

      // Step 2: only now write the DB record, now that we know the Firebase
      // account really exists.
      await finishRegistration();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        // This is exactly the "network dropped mid-signup" scenario: the
        // Firebase account from an earlier attempt already exists, but we
        // don't yet know if the DB record ever got created. Try signing in
        // with the same email/password they just typed — if it's really
        // their own half-finished signup, this succeeds and we can complete
        // it instead of leaving them stuck.
        try {
          await signIn(email, password);

          const existing = await axiosPublic.get(`/user/${email}`);
          if (existing?.data) {
            // Full account already exists — nothing to resume. Sign them
            // back out (this was the signup page, not login) and send them
            // to log in instead.
            await logOut();
            Swal.fire({
              icon: "info",
              title: "এই ইমেইল দিয়ে আগেই একটা অ্যাকাউন্ট আছে",
              text: "দয়া করে লগইন করুন।",
            });
            navigate("/login");
            return;
          }

          // No DB record yet — this really was an interrupted signup.
          // Finish it now instead of making them start over.
          await updateUser(name, photo);
          verifyEmail().catch((err) => {
            console.warn("Could not send verification email:", err.message);
          });
          await finishRegistration();
        } catch (signInError) {
          // Same email, but this password doesn't match — so it's not this
          // person's account (or they've forgotten the password from an
          // earlier attempt). Point them to login/reset instead of a dead end.
          Swal.fire({
            icon: "error",
            title: "এই ইমেইল দিয়ে আগেই একটা অ্যাকাউন্ট আছে",
            text: "পাসওয়ার্ডটা মিলছে না। লগইন করুন, বা পাসওয়ার্ড রিসেট করে নিন।",
          });
          navigate("/login");
        }
        return;
      }

      Swal.fire({
        position: "center",
        icon: "error",
        title: `Registration failed`,
        text: `${error.message}`,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlined />
          </Avatar>

          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              {/* email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="email"
                  id="email"
                  name="email"
                  label="email"
                  autoComplete="email"
                  autoFocus
                />
              </Grid>
              {/* name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="text"
                  id="name"
                  name="name"
                  label="full name"
                  autoComplete="full Name"
                  autoFocus
                />
              </Grid>
              {/* phone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="tel"
                  id="phone"
                  name="phone"
                  label="Phone Number (01XXXXXXXXX)"
                  autoComplete="tel"
                />
              </Grid>

              {/* profile Img */}
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  onChange={handleProfileUpload}
                  type="file"
                  required
                  fullWidth
                  id="profileImg"
                  name="profileImg"
                  variant="outlined"
                  InputProps={{ shrink: true }}
                />
                {(profilePreview || profileUploading) && (
                  <div className="flex items-center gap-2 mt-2">
                    {profilePreview && (
                      <img src={profilePreview} alt="preview" className="w-14 h-14 rounded-full object-cover border" />
                    )}
                    <span className="text-sm text-gray-500">
                      {profileUploading ? "আপলোড হচ্ছে..." : "✅ ছবি সফলভাবে আপলোড হয়েছে"}
                    </span>
                  </div>
                )}
              </Grid>
              {/* Blood Group */}
              <Grid item xs={12} mt={2} sm={6}>
                {/* option  */}
                <OptionAll
                  data={bloodGroup}
                  label={"Select Blood Group"}
                  name={"blood"}
                />
              </Grid>
              {/* Distric  */}
              <Grid item xs={12} sm={6}>
                {/* option  */}
                <Option
                  data={districts}
                  label={"Choose your districts"}
                  name={"distrits"}
                  handleDistricts={handleDistricts}
                />
              </Grid>
              {/* Upuzilla */}
              <Grid item xs={12} sm={6}>
                {/* option  */}

                <OptionAll
                  data={upuzzila}
                  label={"Choose your upuzilla"}
                  name={"upuzilla"}
                />
              </Grid>

              {/* Password  */}
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  type="password"
                  required
                  fullWidth
                  id="password"
                  label="passwrod"
                  name="password"
                  autoComplete="current-password"
                />
              </Grid>
              {/* Confirm Password  */}
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  type="password"
                  required
                  fullWidth
                  id="conPassword"
                  label="confirm passwrod"
                  name="conPassword"
                  autoComplete="confirm-password"
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, color: "white" }}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link to="/login" variant="body2">
                  {"Already have an account? Please Login"}
                </Link>
              </Grid>
            </Grid>

            {/* <GoogleLogin /> */}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignUp;
