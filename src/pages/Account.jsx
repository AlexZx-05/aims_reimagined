import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import { getLoggedInUser, saveUserUpdates } from "../utils/auth";

export default function Account() {
  const [user, setUser] = useState(getLoggedInUser());
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Handle profile picture upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
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
    saveUserUpdates(user);
    setEditMode(false);
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
      <h1 className="text-3xl font-semibold mb-6">My Details</h1>

      <div className="bg-white p-6 rounded-xl shadow border max-w-4xl space-y-10">

        {/* TOP SECTION */}
        <div className="flex items-center gap-6">
          <img
            src={user.photo || "/logo.png"}
            className="w-28 h-28 rounded-full object-cover border"
            alt="profile"
          />

          {editMode && (
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="border px-3 py-2 rounded-lg"
            />
          )}

          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>

          <button
            className="ml-auto bg-blue-900 text-white px-4 py-2 rounded-lg"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* LOCKED FIELDS — Admin-only */}
        <Section title="Admin Locked Fields (Not Editable)">
          <LockedItem label="Name" value={user.name} />
          <LockedItem label="College ID" value={user.id} />
          <LockedItem label="IIITR Email" value={user.email} />
          <LockedItem label="Role" value={user.role} />
        </Section>

        {/* BASIC INFO */}
        <Section title="Basic Information">
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
        </Section>

        {/* CONTACT */}
        <Section title="Contact Information">
          <Item label="Phone Number 1" field="phone1" user={user} edit={editMode} onChange={handleChange} />
          <Item label="Phone Number 2" field="phone2" user={user} edit={editMode} onChange={handleChange} />
          <Item label="Common Email" field="commonEmail" user={user} edit={editMode} onChange={handleChange} />
          <Item label="Languages Known" field="languages" user={user} edit={editMode} onChange={handleChange} />
        </Section>

        {/* GUARDIAN DETAILS */}
        <Section title="Guardian Details">
          <Item label="Father's Name" field="fatherName" user={user} edit={editMode} onChange={handleChange} />
          <Item label="Mother's Name" field="motherName" user={user} edit={editMode} onChange={handleChange} />
          <Item label="Guardian Name" field="guardianName" user={user} edit={editMode} onChange={handleChange} />
          <Item label="Guardian Phone" field="guardianPhone" user={user} edit={editMode} onChange={handleChange} />
          <Item label="Relationship" field="guardianRelation" user={user} edit={editMode} onChange={handleChange} />
        </Section>

        {/* ADDRESS */}
        <Section title="Address">
          <Item label="Address Line 1" field="addressLine1" user={user} edit={editMode} onChange={handleChange} />
          <Item label="Address Line 2" field="addressLine2" user={user} edit={editMode} onChange={handleChange} />
          <Item label="City" field="city" user={user} edit={editMode} onChange={handleChange} />
          <Item label="State" field="state" user={user} edit={editMode} onChange={handleChange} />
          <Item label="Pincode" field="pincode" user={user} edit={editMode} onChange={handleChange} />
        </Section>

        {/* DOCUMENTS */}
        <Section title="Documents Upload">
          <DocumentUpload
            label="Aadhaar"
            field="aadhaar"
            user={user}
            edit={editMode}
            onUpload={handleDocumentUpload}
          />

          <DocumentUpload
            label="10th Marksheet"
            field="marksheet10"
            user={user}
            edit={editMode}
            onUpload={handleDocumentUpload}
          />

          <DocumentUpload
            label="12th Marksheet"
            field="marksheet12"
            user={user}
            edit={editMode}
            onUpload={handleDocumentUpload}
          />

          <DocumentUpload
            label="College ID Card"
            field="collegeID"
            user={user}
            edit={editMode}
            onUpload={handleDocumentUpload}
          />
        </Section>

        {/* SAVE BUTTON */}
        {editMode && (
          <button
            onClick={saveChanges}
            className="bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            Save Changes
          </button>
        )}
      </div>
    </AppLayout>
  );
}

/* ------------------ SUB COMPONENTS ------------------ */

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}

function Item({ label, field, user, edit, onChange, type = "text" }) {
  return (
    <div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      {edit ? (
        <input
          type={type}
          value={user[field] || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full border px-3 py-2 rounded-lg bg-gray-50"
        />
      ) : (
        <p className="font-medium">{user[field] || "—"}</p>
      )}
    </div>
  );
}

function DropDown({ label, field, value, options, edit, onChange }) {
  return (
    <div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      {edit ? (
        <select
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400 hover:shadow-md cursor-pointer appearance-none font-medium"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231f2937' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.7rem center',
            backgroundSize: '1.2em 1.2em',
            paddingRight: '2.5rem'
          }}
        >
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <p className="font-medium">{value || "—"}</p>
      )}
    </div>
  );
}

function LockedItem({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function DocumentUpload({ label, field, user, edit, onUpload }) {
  return (
    <div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>

      {edit ? (
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => onUpload(field, e.target.files[0])}
          className="w-full"
        />
      ) : (
        user[field] ? (
          <a
            href={user[field]}
            target="_blank"
            rel="noreferrer"
            className="text-blue-700 underline"
          >
            View Document
          </a>
        ) : (
          <p className="font-medium">—</p>
        )
      )}
    </div>
  );
}
