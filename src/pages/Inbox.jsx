import AppLayout from "../layouts/AppLayout";

export default function Inbox() {
  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Inbox</h1>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Sidebar */}
        <div className="col-span-3 bg-white rounded-xl border p-4">
          <button className="w-full bg-blue-900 text-white py-2 rounded-lg mb-4">+ Add</button>

          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between"><span>Inbox</span><span>1253</span></div>
            <div className="flex justify-between"><span>Sent</span><span>24,532</span></div>
            <div className="flex justify-between"><span>Draft</span><span>09</span></div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-9 bg-white rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-4">ASHISH K. ARYA</h2>

          <div className="space-y-6">
            <div className="bg-gray-100 p-4 rounded-lg w-3/4">
              Lorem ipsum dolor sit amet…
            </div>

            <div className="bg-blue-900 text-white p-4 rounded-lg ml-auto w-3/4">
              Many variations of passages…
            </div>

            <div className="bg-gray-100 p-4 rounded-lg w-3/4">
              Contrary to popular belief…
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <input
              className="flex-1 px-4 py-2 border rounded-lg"
              placeholder="Write message"
            />
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
              Send
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
