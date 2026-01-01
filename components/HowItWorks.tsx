export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Choose Your Path',
      description: 'Select whether you are an SHS student or university student to get started.'
    },
    {
      number: '2',
      title: 'Enter Your Grades',
      description: 'Input WASSCE grades or university courses with scores and credit hours.'
    },
    {
      number: '3',
      title: 'Get Results & Recommendations',
      description: 'View your aggregate or converted scores with personalized university recommendations.'
    }
  ]

  return (
    <section className="bg-white py-12 md:py-28 w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 md:mb-24">
          How It Works
        </h2>
        <p className="text-gray-600 text-xs md:text-sm mb-6 md:mb-8">
          Three simple steps to get your conversion and recommendations
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10">
          {steps.map((step, index) => (
            <div key={index} className="bg-secondary rounded-lg border border-primary p-4 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                <span className="text-lg font-bold text-primary">{step.number}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
