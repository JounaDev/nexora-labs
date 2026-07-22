import ModelViewer from "@/components/ModelViewer";

export default function ThreeDPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-10">
      <h1 className="mb-8 text-center text-4xl font-bold text-white">
        Modelos 3D Visualiza la plan
      </h1>

      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
        <div className="h-[700px]">
          <ModelViewer url="/models/ps3_slim.glb" />
        </div>
      </div>
    </main>
  );
}