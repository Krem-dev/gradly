import Link from 'next/link'

export default function CallToAction() {
  return (
    <section className="bg-primary py-8 w-full">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Ready to Convert Your Scores?
          </h2>
          <p className="text-white text-opacity-90 mb-6 text-sm">
            Join thousands of students who have successfully converted their academic scores and found their ideal universities.
          </p>
          <Link 
            href="/convert"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
          >
            Start Converting Now
          </Link>
        </div>
      </div>
    </section>
  )
}
