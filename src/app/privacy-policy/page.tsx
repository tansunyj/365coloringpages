import { Metadata } from 'next'
import { Shield, Eye, Lock, UserCheck, Globe, Clock } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy - 365 Coloring Pages',
  description: 'Our comprehensive privacy policy explaining how we collect, use, and protect your personal information.',
  keywords: 'privacy policy, data protection, GDPR, user privacy, data security',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Shield className="h-12 w-12 text-blue-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Your privacy is important to us. Learn how we protect and handle your personal information.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: December 15, 2024</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Introduction</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 leading-relaxed mb-4">
              365 Coloring Pages (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>365coloringpages.com</strong> and use our services.
            </p>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using our website, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use our services.
            </p>
          </div>
        </section>

        {/* Information We Collect */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Information We Collect</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <UserCheck className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              <p className="text-gray-600 mb-3">We may collect the following personal information:</p>
              <ul className="text-gray-600 space-y-2 ml-4">
                <li>• Email address (when you create an account or subscribe to our newsletter)</li>
                <li>• Name or username (when you create an account)</li>
                <li>• Profile information (avatar, preferences)</li>
                <li>• Communication data (when you contact us)</li>
                <li>• Social media account information (when using social login)</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-blue-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Usage Information</h3>
              </div>
              <p className="text-gray-600 mb-3">We automatically collect certain information about your use of our services:</p>
              <ul className="text-gray-600 space-y-2 ml-4">
                <li>• IP address and location data</li>
                <li>• Browser type and version</li>
                <li>• Operating system</li>
                <li>• Pages visited and time spent on our website</li>
                <li>• Referring website addresses</li>
                <li>• Search queries and interactions with our content</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Globe className="h-6 w-6 text-purple-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Cookies and Tracking Technologies</h3>
              </div>
              <p className="text-gray-600 mb-3">We use cookies and similar technologies to:</p>
              <ul className="text-gray-600 space-y-2 ml-4">
                <li>• Remember your preferences and settings</li>
                <li>• Analyze website traffic and usage patterns</li>
                <li>• Provide personalized content and advertisements</li>
                <li>• Maintain your login session</li>
                <li>• Improve our website functionality</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-6">We use the collected information for the following purposes:</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Provision</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Provide access to coloring pages and features</li>
                  <li>• Maintain user accounts and preferences</li>
                  <li>• Process downloads and favorites</li>
                  <li>• Generate AI-powered coloring pages</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Send account-related notifications</li>
                  <li>• Respond to customer support inquiries</li>
                  <li>• Send newsletters and updates (with consent)</li>
                  <li>• Notify about service changes</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Improvement</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Analyze usage patterns and trends</li>
                  <li>• Improve website functionality</li>
                  <li>• Develop new features and content</li>
                  <li>• Optimize user experience</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Compliance</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Comply with legal obligations</li>
                  <li>• Protect against fraud and abuse</li>
                  <li>• Enforce our terms of service</li>
                  <li>• Respond to legal requests</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Information Sharing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Information Sharing and Disclosure</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-6">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Service Providers</h3>
                <p className="text-gray-600">We may share information with trusted third-party service providers who assist us in operating our website, conducting business, or servicing you, provided they agree to keep this information confidential.</p>
              </div>
              
              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Legal Requirements</h3>
                <p className="text-gray-600">We may disclose your information when required by law, court order, or government request, or when we believe disclosure is necessary to protect our rights, property, or safety.</p>
              </div>
              
              <div className="border-l-4 border-green-400 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Business Transfers</h3>
                <p className="text-gray-600">In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction, subject to appropriate confidentiality protections.</p>
              </div>
              
              <div className="border-l-4 border-red-400 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Consent</h3>
                <p className="text-gray-600">We may share your information with your explicit consent or at your direction.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Security</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <Lock className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Our Security Measures</h3>
            </div>
            
            <p className="text-gray-600 mb-6">We implement appropriate technical and organizational measures to protect your personal information:</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <ul className="text-gray-600 space-y-3">
                <li>• <strong>Encryption:</strong> Data transmission using SSL/TLS encryption</li>
                <li>• <strong>Access Controls:</strong> Limited access to personal information</li>
                <li>• <strong>Regular Updates:</strong> Security patches and system updates</li>
                <li>• <strong>Monitoring:</strong> Continuous security monitoring and auditing</li>
              </ul>
              <ul className="text-gray-600 space-y-3">
                <li>• <strong>Data Minimization:</strong> Collecting only necessary information</li>
                <li>• <strong>Secure Storage:</strong> Protected databases and servers</li>
                <li>• <strong>Employee Training:</strong> Staff education on data protection</li>
                <li>• <strong>Incident Response:</strong> Procedures for security breaches</li>
              </ul>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Important:</strong> While we strive to protect your personal information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </p>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Privacy Rights</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-6">Depending on your location, you may have the following rights regarding your personal information:</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Access and Control</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• <strong>Access:</strong> Request a copy of your personal data</li>
                  <li>• <strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li>• <strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li>• <strong>Portability:</strong> Receive your data in a portable format</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Processing Rights</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• <strong>Restriction:</strong> Limit how we process your data</li>
                  <li>• <strong>Objection:</strong> Object to certain data processing</li>
                  <li>• <strong>Withdrawal:</strong> Withdraw consent at any time</li>
                  <li>• <strong>Complaint:</strong> File complaints with supervisory authorities</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                To exercise your rights, please contact us at <strong>591124281yj@gmail.com</strong>. We will respond to your request within 30 days.
              </p>
            </div>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Children&apos;s Privacy</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-4">
              We are committed to protecting the privacy of children. Our website is designed to be family-friendly, but we do not knowingly collect personal information from children under 13 years of age without parental consent.
            </p>
            
            <div className="space-y-4">
                             <div>
                 <h3 className="font-semibold text-gray-900 mb-2">For Children Under 13:</h3>
                 <ul className="text-gray-600 space-y-2 ml-4">
                   <li>• No account creation without parental consent</li>
                   <li>• Limited data collection (only necessary for service provision)</li>
                   <li>• No targeted advertising</li>
                   <li>• Parental right to review and delete child&apos;s information</li>
                 </ul>
               </div>
               
               <div>
                 <h3 className="font-semibold text-gray-900 mb-2">For Parents:</h3>
                 <ul className="text-gray-600 space-y-2 ml-4">
                   <li>• Review your child&apos;s personal information</li>
                   <li>• Request deletion of your child&apos;s account</li>
                   <li>• Refuse further collection of your child&apos;s information</li>
                   <li>• Contact us with any concerns about your child&apos;s privacy</li>
                 </ul>
               </div>
            </div>
          </div>
        </section>

        {/* International Transfers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">International Data Transfers</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-4">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws than your country.
            </p>
            
            <p className="text-gray-600 mb-4">
              When we transfer your personal information internationally, we ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy and applicable laws.
            </p>
            
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Safeguards Include:</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Adequacy decisions by relevant authorities</li>
                <li>• Standard contractual clauses</li>
                <li>• Binding corporate rules</li>
                <li>• Certification schemes and codes of conduct</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Updates and Contact */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Policy Updates</h3>
              </div>
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
              </p>
              <p className="text-gray-600">
                We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h3>
              <p className="text-gray-600 mb-4">
                If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-600">
                <p><strong>Email:</strong> 591124281yj@gmail.com</p>
                <p><strong>Subject Line:</strong> Privacy Policy Inquiry</p>
                <p><strong>Response Time:</strong> Within 48 hours</p>
              </div>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  )
} 