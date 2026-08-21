import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import Option from "../../../../Components/Option/Option";
import useDistricts from "../../../../hooks/useDistricts";
import OptionAll from "../../../../Components/Option/OptionAll";
import { Box, TextField } from "@mui/material";

import { Edit } from "@mui/icons-material";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const image_hosting = import.meta.env.VITE_IMAGE_HOST;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting}`;

// Shown whenever someone removes their photo instead of leaving profileImg
// empty (an empty src would just show a broken image everywhere).
const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=7A1128&textColor=ffffff";
const DEFAULT_COVER =
  "https://images.pexels.com/photos/12227661/pexels-photo-12227661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

const ProfileModal = ({ userData, isUserLoading, refetch }) => {
  const axiosSecure = useAxiosSecure()


  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [districts, handleDistricts, upuzzila] = useDistricts();
  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [profilePreview, setProfilePreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [profileUploading, setProfileUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  // Tracks an explicit "Remove Photo" click, separate from "nothing changed".
  // Without this, an empty profileImage would just fall back to the old
  // photo on submit instead of actually clearing it.
  const [profileRemoved, setProfileRemoved] = useState(false);
  const [coverRemoved, setCoverRemoved] = useState(false);



  if (isUserLoading) {
    return <>Loading..........</>
  }
  const { blood, _id, districts: district, upuzilla, name, profileImg, coverImg } = userData;

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
      // show an instant local preview so the person sees feedback right away,
      // without waiting for the upload to finish
      setProfilePreview(URL.createObjectURL(file));
      setProfileUploading(true);
      setProfileRemoved(false);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(image_hosting_api, {
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

  const handleRemoveProfilePhoto = () => {
    setProfileImage("");
    setProfilePreview("");
    setProfileRemoved(true);
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      setCoverUploading(true);
      setCoverRemoved(false);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(image_hosting_api, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const { display_url } = data.data;
          setCoverImage(display_url);
        } else {
          Swal.fire({ icon: "error", title: "ছবি আপলোড হয়নি", text: "আবার চেষ্টা করুন, বা অন্য একটা ছবি দিয়ে দেখুন।" });
          setCoverPreview("");
        }
      } catch (error) {
        Swal.fire({ icon: "error", title: "ছবি আপলোড হয়নি", text: error.message });
        setCoverPreview("");
      }
      setCoverUploading(false);
    }
  };

  const handleRemoveCoverPhoto = () => {
    setCoverImage("");
    setCoverPreview("");
    setCoverRemoved(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    // TODO: SEND DB
    const userInfo = {
      name: data.get("name"),
      phone: data.get("phone"),
      blood: data.get("blood"),
      districts: data.get("districts") || district,
      upuzilla: data.get("upuzlia") || upuzilla,
      // Explicit "Remove" beats any leftover upload, which beats keeping
      // the existing photo — this is what makes remove actually clear the
      // DB value instead of quietly falling back to the old picture.
      profileImg: profileRemoved ? DEFAULT_AVATAR : (profileImage || profileImg),
      coverImg: coverRemoved ? DEFAULT_COVER : (coverImage || coverImg),
    };


    await axiosSecure.patch(`/user/updateProfile/${_id}`, userInfo)
      .then(res => {
        // console.log(res.data)
        refetch()
        if (res.data.modifiedCount > 0) {
          Swal.fire({
            title: `You user profile Updated Successfully!`,
            icon: 'success',
            position: 'center',
            timer: 1500
          })

          setOpen(false)
        }
      })



  };

  return (
    <>
      <button
        type="button"
        className="btn py-2 px-3 rounded-xl text-white bg-[#7A1128]"
        onClick={() => setOpen(true)}
        ref={cancelButtonRef}
      >
        <Edit />
        {"Edit Profile"}
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-9999 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Box component="form" onSubmit={handleSubmit}>
                  <Dialog.Panel
                    className="relative z-9999 transform overflow-hidden
                   rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                  >
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <h2 className="text-3xl text-center">Update Profile</h2>
                      <div className="flex-col space-y-4 my-auto items-center justify-center  p-5 gap-5">
                        <div className="flex gap-5">
                          <div className="w-full">
                            <TextField
                              type="text"
                              id="name"
                              name="name"
                              label="name"
                              defaultValue={name}
                              autoComplete="name"
                            />
                          </div>
                          <div className="w-full">
                            <TextField
                              type="tel"
                              id="phone"
                              name="phone"
                              label="Phone number (SMS alert-এর জন্য)"
                              defaultValue={userData?.phone}
                              placeholder="01XXXXXXXXX"
                            />
                          </div>
                          {/* Blood  */}
                          <div className="w-full">
                            <OptionAll
                              data={bloodGroup}
                              value={blood}
                              label={blood}
                              name={"blood"}
                            />
                          </div>
                        </div>

                        <div className="flex gap-5">
                          <div className="w-full">
                            <Option
                              data={districts}
                              label={district}
                              name={"districts"}
                              handleDistricts={handleDistricts}
                            ></Option>
                          </div>

                          {/* Upuzila  */}

                          <div className="w-full">
                            <Option
                              data={upuzzila}
                              label={upuzilla}
                              name={"upuzlia"}
                              handleDistricts={handleDistricts}
                            />
                          </div>
                        </div>
                        <div className="flex gap-5">
                          <div className="w-full">
                            <label>Profile Picture</label>
                            <TextField
                              onChange={handleProfileUpload}
                              type="file"
                              id="profilePic"
                              name="profilePic"
                            />
                            <div className="flex items-center gap-2 mt-2">
                              {!profileRemoved && (profilePreview || profileImg) && (
                                <img
                                  src={profilePreview || profileImg}
                                  alt="preview"
                                  className="w-14 h-14 rounded-full object-cover border"
                                />
                              )}
                              {profileUploading ? (
                                <span className="text-sm text-gray-500">আপলোড হচ্ছে...</span>
                              ) : (
                                <>
                                  {profilePreview && (
                                    <span className="text-sm text-gray-500">
                                      ✅ আপলোড সম্পন্ন — Save করলে সেভ হবে
                                    </span>
                                  )}
                                  {!profileRemoved && (profilePreview || profileImg) && (
                                    <button
                                      type="button"
                                      onClick={handleRemoveProfilePhoto}
                                      className="text-sm text-red-600 underline"
                                    >
                                      ছবি মুছে ফেলুন
                                    </button>
                                  )}
                                  {profileRemoved && (
                                    <span className="text-sm text-gray-500">
                                      ছবি মুছে ফেলা হবে — Save করলে সেভ হবে
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Cover Upload  */}

                          <div className="w-full">
                            <label>Cover Picture</label>
                            <TextField
                              type="file"
                              id="CoverImg"
                              onChange={handleCoverUpload}
                              name="coverImg"
                            />
                            <div className="flex items-center gap-2 mt-2">
                              {!coverRemoved && (coverPreview || coverImg) && (
                                <img
                                  src={coverPreview || coverImg}
                                  alt="preview"
                                  className="w-20 h-14 rounded object-cover border"
                                />
                              )}
                              {coverUploading ? (
                                <span className="text-sm text-gray-500">আপলোড হচ্ছে...</span>
                              ) : (
                                <>
                                  {coverPreview && (
                                    <span className="text-sm text-gray-500">
                                      ✅ আপলোড সম্পন্ন — Save করলে সেভ হবে
                                    </span>
                                  )}
                                  {!coverRemoved && (coverPreview || coverImg) && (
                                    <button
                                      type="button"
                                      onClick={handleRemoveCoverPhoto}
                                      className="text-sm text-red-600 underline"
                                    >
                                      ছবি মুছে ফেলুন
                                    </button>
                                  )}
                                  {coverRemoved && (
                                    <span className="text-sm text-gray-500">
                                      ছবি মুছে ফেলা হবে — Save করলে সেভ হবে
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Box>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default ProfileModal;
