export default function SupportedCountries() {
  const countries = [
    'Nigeria',
    'Ghana',
    'Kenya',
    'South Africa',
    'United Kingdom',
    'United States',
    'Canada',
    'India',
    'Pakistan',
    'Bangladesh',
    'Australia',
    'Germany'
  ]

  return (
    <section className="bg-background py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-textPrimary text-center mb-4">
          Supported Countries & Regions
        </h2>
        <p className="text-textSecondary text-center mb-12 max-w-2xl mx-auto">
          Gradly supports academic grading systems from multiple countries and regions, ensuring accurate conversions for international applications.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {countries.map((country, index) => (
            <div 
              key={index}
              className="bg-backgroundLight border border-border rounded-lg px-6 py-4 text-center text-textPrimary font-medium"
            >
              {country}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
