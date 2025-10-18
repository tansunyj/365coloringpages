import { Metadata } from 'next'
import { FileText, Users, AlertTriangle, Scale, Shield, Gavel } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service - 365 Coloring Pages',
  description: 'Read our terms of service to understand your rights and responsibilities when using our coloring pages platform.',
  keywords: 'terms of service, user agreement, legal terms, website terms, conditions of use',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <FileText className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Please read these terms carefully before using our services. By using our website, you agree to these terms.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: December 15, 2024</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Agreement */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Agreement to Terms</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 leading-relaxed mb-4">
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement made between you, whether personally or on behalf of an entity (&quot;you&quot;), and 365 Coloring Pages (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), concerning your access to and use of the 365coloringpages.com website as well as any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the &quot;Service&quot;).
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              You agree that by accessing the Service, you have read, understood, and agreed to be bound by all of these Terms. If you do not agree with all of these Terms, then you are expressly prohibited from using the Service and you must discontinue use immediately.
            </p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                <strong>Important:</strong> Supplemental terms and conditions or documents that may be posted on the Service from time to time are hereby expressly incorporated herein by reference.
              </p>
            </div>
          </div>
        </section>

        {/* Acceptable Use */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Acceptable Use</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Permitted Uses</h3>
              </div>
              <p className="text-gray-600 mb-3">You may use our Service for the following purposes:</p>
              <ul className="text-gray-600 space-y-2 ml-4">
                <li>Download and print coloring pages for personal, educational, or non-commercial use</li>
                <li>Create user accounts to save favorites and track downloads</li>
                <li>Use our AI generator to create custom coloring pages</li>
                <li>Share completed colored artwork on social media with proper attribution</li>
                <li>Use our content in educational settings (schools, libraries, community centers)</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Prohibited Uses</h3>
              </div>
              <p className="text-gray-600 mb-3">You may NOT use our Service:</p>
              <ul className="text-gray-600 space-y-2 ml-4">
                <li>To sell, redistribute, or commercially exploit our coloring pages</li>
                <li>To remove watermarks, copyright notices, or attribution</li>
                <li>To create competing coloring page websites or apps</li>
                <li>To upload malicious content, viruses, or harmful code</li>
                <li>To harass, abuse, or harm other users</li>
                <li>To violate any applicable laws or regulations</li>
                <li>To impersonate others or provide false information</li>
                <li>To attempt unauthorized access to our systems</li>
              </ul>
            </div>
          </div>
        </section>

        {/* User Accounts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">User Accounts</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Creation</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>You must notify us of any unauthorized access</li>
                  <li>One account per person or organization</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Responsibilities</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>Keep your login credentials confidential</li>
                  <li>Update your information when necessary</li>
                  <li>Comply with all terms and policies</li>
                  <li>Report any suspicious activity</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> We reserve the right to suspend or terminate accounts that violate these Terms or engage in inappropriate behavior.
              </p>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Intellectual Property Rights</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Scale className="h-8 w-8 text-purple-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Our Content</h3>
              </div>
              
              <p className="text-gray-600 mb-6">The Service and its original content, features, and functionality are and will remain the exclusive property of 365 Coloring Pages and its licensors.</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Protected Elements</h4>
                  <ul className="text-gray-600 space-y-2">
                    <li>Original coloring page designs</li>
                    <li>Website design and layout</li>
                    <li>Software and algorithms</li>
                    <li>Trademarks and logos</li>
                    <li>Text and descriptions</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Your Rights</h4>
                  <ul className="text-gray-600 space-y-2">
                    <li>Personal use of coloring pages</li>
                    <li>Educational use in classrooms</li>
                    <li>Non-commercial sharing with attribution</li>
                    <li>Coloring and displaying finished artwork</li>
                    <li>Printing for personal enjoyment</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">User-Generated Content</h3>
              
              <p className="text-gray-600 mb-4">
                When you upload, submit, or create content through our Service (such as AI-generated coloring pages), you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content in connection with the Service.
              </p>
              
              <div className="space-y-3">
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">You Represent That:</h4>
                  <p className="text-gray-600">You own or have necessary rights to any content you submit, and it does not infringe on third-party rights.</p>
                </div>
                
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">We May:</h4>
                  <p className="text-gray-600">Remove any content that violates these Terms or is otherwise objectionable in our sole discretion.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy and Data */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy and Data Protection</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-blue-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Your Privacy Matters</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service. By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Data Collection</h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>Account information (email, username)</li>
                  <li>Usage data and preferences</li>
                  <li>Device and browser information</li>
                  <li>Cookies and tracking technologies</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Your Rights</h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>Access and update your data</li>
                  <li>Request data deletion</li>
                  <li>Opt-out of communications</li>
                  <li>Data portability</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                For detailed information about our privacy practices, please review our <strong>Privacy Policy</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Disclaimers and Limitations</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Availability</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">&quot;As Is&quot; Basis</h4>
                  <p className="text-gray-600">
                    The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no representations or warranties of any kind, express or implied, regarding the Service.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">No Guarantees</h4>
                  <p className="text-gray-600">
                    We do not guarantee that the Service will be uninterrupted, error-free, or completely secure. Temporary interruptions may occur due to maintenance, updates, or technical issues.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Content Accuracy</h4>
                  <p className="text-gray-600">
                    While we strive to provide high-quality content, we do not warrant the accuracy, completeness, or reliability of any information on the Service.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Limitation of Liability</h3>
              
              <p className="text-gray-600 mb-4">
                To the fullest extent permitted by applicable law, in no event shall 365 Coloring Pages, its affiliates, officers, directors, employees, agents, or licensors be liable for any indirect, incidental, special, consequential, or punitive damages.
              </p>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Maximum Liability</h4>
                <p className="text-red-700 text-sm">
                  Our total liability to you for all damages shall not exceed the amount you paid us (if any) in the twelve (12) months preceding the event giving rise to liability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Termination */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Termination</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">By You</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>You may terminate your account at any time</li>
                  <li>Simply stop using the Service</li>
                  <li>Contact us to delete your account</li>
                  <li>Downloaded content may be retained for personal use</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">By Us</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>We may suspend or terminate accounts for violations</li>
                  <li>We may discontinue the Service with notice</li>
                  <li>We may modify or restrict access</li>
                  <li>Termination may be immediate for serious violations</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Effect of Termination</h4>
              <p className="text-gray-600 text-sm">
                Upon termination, your right to use the Service ceases immediately. Provisions that should survive termination (including intellectual property rights, disclaimers, and limitations of liability) will continue to apply.
              </p>
            </div>
          </div>
        </section>

        {/* Governing Law */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Governing Law and Disputes</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <Gavel className="h-8 w-8 text-indigo-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Legal Framework</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Governing Law</h4>
                <p className="text-gray-600">
                  These Terms shall be interpreted and enforced in accordance with the laws of the jurisdiction where 365 Coloring Pages is operated, without regard to conflict of law principles.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Dispute Resolution</h4>
                <p className="text-gray-600 mb-3">
                  In the event of any dispute arising out of or relating to these Terms or the Service:
                </p>
                <ol className="text-gray-600 space-y-2 ml-6" style={{listStyleType: 'decimal'}}>
                  <li>First, contact us directly to attempt informal resolution</li>
                  <li>If informal resolution fails, disputes may be resolved through binding arbitration</li>
                  <li>Class action lawsuits and jury trials are waived</li>
                  <li>Any arbitration must be conducted individually, not as part of a class action</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Exceptions</h4>
                <p className="text-gray-600">
                  Either party may seek injunctive relief in court for intellectual property infringement or other urgent matters that cannot wait for arbitration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Changes and Contact */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Changes to Terms</h3>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes by posting the updated Terms on our website and updating the &quot;Last updated&quot; date.
              </p>
              <p className="text-gray-600 text-sm">
                Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="space-y-2 text-gray-600 text-sm">
                <p><strong>Email:</strong> 591124281yj@gmail.com</p>
                <p><strong>Subject:</strong> Terms of Service Inquiry</p>
                <p><strong>Response Time:</strong> Within 48 hours</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Provisions */}
        <section className="mb-12">
          <div className="bg-gray-100 p-8 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Provisions</h3>
            
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Severability</h4>
                <p>If any provision of these Terms is found unenforceable, the remainder shall remain in full force and effect.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Waiver</h4>
                <p>No waiver of any term shall be deemed a further or continuing waiver of such term or any other term.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Entire Agreement</h4>
                <p>These Terms constitute the entire agreement between you and us regarding the Service.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Assignment</h4>
                <p>You may not assign your rights under these Terms. We may assign our rights to any affiliate or successor.</p>
              </div>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  )
} 