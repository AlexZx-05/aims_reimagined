import AppLayout from "../layouts/AppLayout";

export default function Calendar() {
  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Calendar</h1>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 bg-white p-4 rounded-xl border">
          <button className="w-full bg-blue-900 text-white py-2 rounded-lg mb-4">
            + Add New Event
          </button>

          <div className="space-y-4">
            <div>
              <p className="font-medium">Gandhi Jayanti</p>
              <p className="text-gray-500 text-sm">Today 07:19 AM</p>
            </div>
            <div>
              <p className="font-medium">Mid Term</p>
              <p className="text-gray-500 text-sm">20–22 Oct</p>
            </div>
          </div>
        </div>

        <div className="col-span-9 bg-white p-4 rounded-xl border">
          <h2 className="text-lg font-semibold mb-4">October 2025</h2>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="border h-24 rounded-md p-2 text-sm">
                {i + 1 <= 31 ? i + 1 : ""}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
