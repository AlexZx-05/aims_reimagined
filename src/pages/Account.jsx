import { useState, useRef } from "react";
import AppLayout from "../layouts/AppLayout";
import { getLoggedInUser, saveUserUpdates } from "../utils/auth";
import {
  Lock,
  User as UserIcon,
  FileText,
  Phone,
  Home,
  Upload,
  Settings,
  Camera
} from "lucide-react";

/**
 * Account page — clickable avatar upload (in edit mode), wider layout (max-w-5xl),
 * College ID removed from Documents upload (kept in locked fields instead).
 */

export default function Account() {
  const [user, setUser] = useState(getLoggedInUser());
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // ref to avatar file input so we can trigger it from avatar click
  const avatarInputRef = useRef(null);

  // Convert file → base64
  const toBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  };

  // Update object values
  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  // Handle profile picture upload (triggered from the hidden avatar input)
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toBase64(file, (result) => {
      handleChange("photo", result);
    });
  };

  // Handle document upload (aadhaar, marksheet etc.)
  const handleDocumentUpload = (field, file) => {
    if (!file) return;

    toBase64(file, (result) => {
      handleChange(field, result);
    });
  };

  // Save all updates
  const saveChanges = () => {
    setLoading(true);
    try {
      saveUserUpdates(user);
    } finally {
      setLoading(false);
      setEditMode(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading Account Management Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen py-8 bg-gray-50">
        {/* Wider container: max-w-5xl */}
        <div className="max-w-5xl mx-auto w-full px-4">
          {/* Header area with avatar and actions */}
          <div className="flex items-center gap-6 mb-6">
            {/* Avatar area: clickable when editMode */}
            <div className="relative">
              <img
                src={user.photo || "/logo.png"}
                alt="profile"
                className={`w-28 h-28 rounded-full object-cover border transition-shadow ${
                  editMode ? "cursor-pointer shadow-md" : ""
                }`}
                onClick={() => {
                  if (editMode && avatarInputRef.current) avatarInputRef.current.click();
                }}
              />

              {/* Camera overlay shown only in edit mode */}
              {editMode && (
                <button
                  type="button"
                  onClick={() => avatarInputRef.current && avatarInputRef.current.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/25 rounded-full opacity-0 hover:opacity-100 transition"
                  aria-label="Upload profile photo"
                >
                  <Camera size={20} className="text-white" />
                </button>
              )}

              {/* hidden file input for avatar */}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold truncate">{user.name}</h1>
              <p className="text-gray-500 truncate">{user.email}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditMode((s) => !s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  editMode ? "bg-gray-200 text-gray-800" : "bg-blue-900 text-white"
                }`}
              >
                {editMode ? "Cancel" : "Edit"}
              </button>

              {editMode && (
                <button
                  onClick={saveChanges}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium"
                >
                  Save
                </button>
              )}
            </div>
          </div>

          {/* Page card wrapper (stack of cards) */}
          <div className="space-y-6">
            {/* Admin Locked Fields */}
            <Card title="Admin Locked Fields" icon={<Lock size={18} />} subtitle="Fields controlled by admin">
              <div className="space-y-3">
                <LockedItem label="Name" value={user.name} />
                <LockedItem label="College ID" value={user.id} />
                <LockedItem label="IIITR Email" value={user.email} />
                <LockedItem label="Role" value={user.role} />
              </div>
            </Card>

            {/* Basic Information */}
            <Card title="Basic Information" icon={<UserIcon size={18} />}>
              <div className="space-y-3">
                <DropDown
                  label="Gender"
                  field="gender"
                  value={user.gender}
                  options={["Male", "Female", "Other"]}
                  edit={editMode}
                  onChange={handleChange}
                />

                <DropDown
                  label="Blood Group"
                  field="bloodGroup"
                  value={user.bloodGroup}
                  options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
                  edit={editMode}
                  onChange={handleChange}
                />

                <DropDown
                  label="Religion"
                  field="religion"
                  value={user.religion}
                  options={["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Other"]}
                  edit={editMode}
                  onChange={handleChange}
                />

                <DropDown
                  label="Marital Status"
                  field="maritalStatus"
                  value={user.maritalStatus}
                  options={["Single", "Married"]}
                  edit={editMode}
                  onChange={handleChange}
                />

                <Item
                  label="Date of Birth"
                  field="dob"
                  user={user}
                  edit={editMode}
                  onChange={handleChange}
                  type="date"
                />
              </div>
            </Card>

            {/* Contact Information */}
            <Card title="Contact Information" icon={<Phone size={18} />}>
              <div className="space-y-3">
                <Item label="Phone Number 1" field="phone1" user={user} edit={editMode} onChange={handleChange} />
                <Item label="Phone Number 2" field="phone2" user={user} edit={editMode} onChange={handleChange} />
                <Item label="Common Email" field="commonEmail" user={user} edit={editMode} onChange={handleChange} />
                <Item label="Languages Known" field="languages" user={user} edit={editMode} onChange={handleChange} />
              </div>
            </Card>

            {/* Guardian Details */}
            <Card title="Guardian Details" icon={<FileText size={18} />}>
              <div className="space-y-3">
                <Item label="Father's Name" field="fatherName" user={user} edit={editMode} onChange={handleChange} />
                <Item label="Mother's Name" field="motherName" user={user} edit={editMode} onChange={handleChange} />
                <Item label="Guardian Name" field="guardianName" user={user} edit={editMode} onChange={handleChange} />
                <Item label="Guardian Phone" field="guardianPhone" user={user} edit={editMode} onChange={handleChange} />
                <Item label="Relationship" field="guardianRelation" user={user} edit={editMode} onChange={handleChange} />
              </div>
            </Card>

            {/* Address */}
            <Card title="Address" icon={<Home size={18} />}>
              <div className="space-y-3">
                <Item label="Address Line 1" field="addressLine1" user={user} edit={editMode} onChange={handleChange} />
                <Item label="Address Line 2" field="addressLine2" user={user} edit={editMode} onChange={handleChange} />
                <Item label="City" field="city" user={user} edit={editMode} onChange={handleChange} />
                <Item label="State" field="state" user={user} edit={editMode} onChange={handleChange} />
                <Item label="Pincode" field="pincode" user={user} edit={editMode} onChange={handleChange} />
              </div>
            </Card>

            {/* Documents Upload (College ID removed from here) */}
            <Card title="Documents & Uploads" icon={<Upload size={18} />}>
              <div className="space-y-3">
                <DocumentUpload label="Aadhaar" field="aadhaar" user={user} edit={editMode} onUpload={handleDocumentUpload} />
                <DocumentUpload label="10th Marksheet" field="marksheet10" user={user} edit={editMode} onUpload={handleDocumentUpload} />
                <DocumentUpload label="12th Marksheet" field="marksheet12" user={user} edit={editMode} onUpload={handleDocumentUpload} />
                {/* College ID removed as requested */}
              </div>
            </Card>

            {/* Misc / Settings */}
            <Card title="Preferences" icon={<Settings size={18} />}>
              <div className="space-y-3">
                <Item label="Preferred Language" field="preferredLanguage" user={user} edit={editMode} onChange={handleChange} />
                <Item label="Notification Preference" field="notifications" user={user} edit={editMode} onChange={handleChange} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

/* ------------------ Small Reusable UI Pieces ------------------ */

function Card({ title, icon = null, subtitle = null, children }) {
  return (
    <section className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center gap-3">
        <div className="text-blue-900">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        </div>
      </div>

      <div className="px-6 py-6">
        {/* centered content, stacked; remove restrictive inner max width to use wider layout */}
        <div className="space-y-4 mx-auto">{children}</div>
      </div>
    </section>
  );
}

function LockedItem({ label, value }) {
  return (
    <div className="bg-gray-50 border rounded-lg p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium mt-1">{value ?? "—"}</p>
    </div>
  );
}

function Item({ label, field, user, edit, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-gray-500 block mb-1">{label}</label>
      {edit ? (
        <input
          type={type}
          value={user[field] || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full border px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      ) : (
        <div className="bg-white border rounded-lg p-3">
          <p className="font-medium">{user[field] || "—"}</p>
        </div>
      )}
    </div>
  );
}

function DropDown({ label, field, value, options, edit, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-500 block mb-1">{label}</label>
      {edit ? (
        <select
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:border-gray-400 cursor-pointer appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231f2937' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.7rem center",
            backgroundSize: "1.2em 1.2em",
            paddingRight: "2.5rem"
          }}
        >
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <div className="bg-white border rounded-lg p-3">
          <p className="font-medium">{value || "—"}</p>
        </div>
      )}
    </div>
  );
}

function DocumentUpload({ label, field, user, edit, onUpload }) {
  return (
    <div>
      <label className="text-sm text-gray-500 block mb-1">{label}</label>

      {edit ? (
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => onUpload(field, e.target.files[0])}
            className="flex-1"
          />
          <div className="text-sm text-gray-500">Allowed: jpg, png, pdf</div>
        </div>
      ) : user[field] ? (
        <a
          href={user[field]}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-blue-700 underline"
        >
          View Document
        </a>
      ) : (
        <div className="bg-white border rounded-lg p-3">
          <p className="font-medium">—</p>
        </div>
      )}
    </div>
  );
}
