import { useState } from "react";

export default function App() {
  const [num, setNum] = useState(1);

  function tambahNum() {
    setNum(num + 1);
  }
  function kurangNum() {
    if (num > 0) {
      setNum(num - 1);
    }
  }
  const data = [
    { name: "John Doe", job: "Web Developer" },
    { name: "Jane Smith", job: "UI/UX Designer" },
    { name: "Bob Johnson", job: "Mobile Developer" },
    { name: "Alice Brown", job: "Data Scientist" },
  ];

  return (
    <>
      <div className=" container w-full max-w-5xl mx-auto p-4">
        <div className=" flex justify-center mt-3 text-3xl font-bold uppercase">
          <h2>Coba React</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-colss-3 gap-6">
          {data.map((person, index) => (
            <div key={index}>
              <h3>Nama : {person.name}</h3>
              <p>Job : {person.job}</p>
            </div>
          ))}
        </div>
        <div className=" text-cyan-950 text-3xl">
          <p>Angka : {num}</p>
          <button
            onClick={tambahNum}
            className=" bg-red-600 text-white px-4 py-2 rounded hover:bg-slate-700"
          >
            Tambah 1
          </button>
          <button
            onClick={kurangNum}
            className=" bg-red-600 text-white px-4 py-2 rounded hover:bg-slate-700"
          >
            Kurang
          </button>
        </div>
      </div>
    </>
  );
}
