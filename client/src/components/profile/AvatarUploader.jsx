
"use client";

import Cropper from "react-easy-crop";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { getCroppedImg } from "@/utils/cropImage";
import {
  useUpdateAvatarMutation,
  useRemoveAvatarMutation,
} from "@/features/users/userApi";
import { getDefaultAvatar } from "@/utils/getDefaultAvatar";
import AvatarSkeleton from "../ui/AvatarSkeleton";

export default function AvatarUploader({ user, onUpdated }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState(null);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);


  const [updateAvatar, { isLoading }] = useUpdateAvatarMutation();
  const [removeAvatar, { isLoading: removing }] = useRemoveAvatarMutation();
  


  /* ---------------- FILE UPLOAD ---------------- */

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCropPixels(croppedAreaPixels);
  };

  const uploadCropped = async () => {
    const blob = await getCroppedImg(imageSrc, cropPixels);

    const formData = new FormData();
    formData.append("avatar", blob);

    const res = await updateAvatar(formData).unwrap();
    onUpdated(res.avatar);

    setOpen(false);
    setImageSrc(null);
  };

  /* ---------------- REMOVE ---------------- */

  const handleRemove = async () => {
    if (!confirm("Remove profile photo?")) return;

    await removeAvatar().unwrap();
    onUpdated(null);

    setOpen(false);
  };

  return (
    <div className="relative group">
      {/* Avatar */}
      <div className="relative h-16 w-16">
  {progress > 0 && (
    <svg className="absolute inset-0 -rotate-90">
      <circle
        cx="32"
        cy="32"
        r="30"
        stroke="#e5e7eb"
        strokeWidth="3"
        fill="none"
      />
      <circle
        cx="32"
        cy="32"
        r="30"
        stroke="#6366f1"
        strokeWidth="3"
        fill="none"
        strokeDasharray="188"
        strokeDashoffset={188 - (188 * progress) / 100}
        strokeLinecap="round"
      />
    </svg>
  )}

  <img
    src={user.avatar || getDefaultAvatar(user.role)}
    className={`h-16 w-16 rounded-full object-cover ${
      progress ? "opacity-60" : ""
    }`}
  />
</div>

      {/* ✏️ Edit Button */}
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-0 right-0 bg-gray-500 text-white p-1.5 rounded-full shadow hover:bg-gray-400 opacity-0 group-hover:opacity-100 transition"
        title="Edit avatar"
      >
        <Pencil size={14} color="white" />
      </button>

      {/* ---------------- MODAL ---------------- */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-4 w-[360px] space-y-4">
            {imageSrc ? (
              <>
                <div className="relative h-64 bg-gray-200 rounded overflow-hidden">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setOpen(false)}
                    className="text-sm text-gray-500"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={uploadCropped}
                    disabled={isLoading}
                    className="bg-indigo-600 text-white px-4 py-1.5 rounded text-sm"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <label className="block w-full text-center cursor-pointer border border-dashed rounded-lg py-8 text-sm text-gray-600 hover:bg-gray-50">
                  Click to upload new photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={onFileChange}
                  />
                </label>

                {user.avatar && (
                  <button
                    onClick={handleRemove}
                    disabled={removing}
                    className="w-full text-sm text-red-600 border rounded-md hover:bg-red-50 py-1.5"
                  >
                    Remove current photo
                  </button>
                )}

                <button
                  onClick={() => setOpen(false)}
                  className="block w-full text-sm text-gray-800 border rounded-md hover:bg-gray-200 py-1.5"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
