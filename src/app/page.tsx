import Image from 'next/image'

export default function HomePage(): React.JSX.Element {
  return (
    <main className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <Image src="/brand/cy-mark.svg" alt="CarsickYak mark" width={96} height={96} priority />
      <h1 className="font-serif text-5xl font-semibold tracking-tight">CarsickYak</h1>
      <p className="text-muted-foreground max-w-prose text-lg">
        Ranked grinder and folk outdoorsman. The hub site is under construction.
      </p>
      <p className="text-ember font-medium">Coming soon.</p>
    </main>
  )
}
