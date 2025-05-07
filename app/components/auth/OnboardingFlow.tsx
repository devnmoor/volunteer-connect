// app/components/auth/OnboardingFlow.tsx
'use client';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/lib/firebase/config';
import { createUserProfile, determineUserLevel, UserProfile } from '@/app/lib/firebase/auth';

const OnboardingFlow = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Personal Information
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [showState, setShowState] = useState(false);

  // Location
  const [locationShared, setLocationShared] = useState(false);
  const tempLocation = useRef<{ latitude: number; longitude: number } | undefined>(undefined);
  // Step 2: Commitment
  const [weeklyCommitment, setWeeklyCommitment] = useState<number>(1);
  const [volunteeringGoal, setVolunteeringGoal] = useState('');

  // Step 3: Interests
  const [interests, setInterests] = useState<string[]>([]);
  const interestOptions = ['STEM', 'Art', 'Environment', 'Animals', 'Education', 'Sports', 'Technology', 'Music', 'Health', 'Community'];

  // Step 4: Category Ranking
  const [communityServiceRank, setCommunityServiceRank] = useState<number>(0);
  const [environmentalActionRank, setEnvironmentalActionRank] = useState<number>(0);
  const [educationYouthSupportRank, setEducationYouthSupportRank] = useState<number>(0);
  const [healthWellnessRank, setHealthWellnessRank] = useState<number>(0);

  // Step 5: Guardian information (for users 16-20 who want Bloom level)
  const [hasGuardian, setHasGuardian] = useState(false);
  const [guardianEmail, setGuardianEmail] = useState('');

  // Handle country change to show/hide state input for US
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setShowState(selectedCountry === 'United States');
    if (selectedCountry !== 'United States') {
      setState('');
    }
  };

  // Toggle interest selection
  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  // Handle category rank selection
  const handleRankSelect = (category: 'community' | 'environment' | 'education' | 'health', rank: number) => {
    if (category === 'community') setCommunityServiceRank(rank);
    if (category === 'environment') setEnvironmentalActionRank(rank);
    if (category === 'education') setEducationYouthSupportRank(rank);
    if (category === 'health') setHealthWellnessRank(rank);
  };

  // Check if all categories have a unique rank
  const isRankingValid = () => {
    const ranks = [communityServiceRank, environmentalActionRank, educationYouthSupportRank, healthWellnessRank];
    const uniqueRanks = new Set(ranks.filter(r => r > 0));
    return uniqueRanks.size === 4 && !ranks.includes(0);
  };

  // Handle next step
  const handleNextStep = () => {
    if (step === 1) {
      if (!name || !age || !country || (showState && !state)) {
        setError('Please fill in all required fields');
        return;
      }

      // If user is under 16, skip directly to step 3 (interests)
      if (typeof age === 'number' && age < 16) {
        setStep(3);
      } else {
        setStep(step + 1);
      }
    } else if (step === 2) {
      if (!volunteeringGoal) {
        setError('Please enter your volunteering goal');
        return;
      }
      setStep(step + 1);
    } else if (step === 3) {
      // Interests step is optional
      setStep(step + 1);
    } else if (step === 4) {
      if (!isRankingValid()) {
        setError('Please provide a unique rank (1-4) for each category');
        return;
      }

      // If user is between 16-20, show guardian step
      if (typeof age === 'number' && age >= 16 && age < 21) {
        setStep(step + 1);
      } else {
        // For users 21+, show location step
        if (typeof age === 'number' && age >= 21) {
          setStep(6); // Go to location step
        } else {
          handleSubmit();
        }
      }
    } else if (step === 5) {
      if (hasGuardian && !guardianEmail) {
        setError('Please provide a guardian email');
        return;
      }
      // Show location step for Bud and Bloom levels
      if (typeof age === 'number' && age >= 16) {
        setStep(6); // Go to location step
      } else {
        handleSubmit();
      }
    } else if (step === 6) {
      // Location step - will capture location during handleSubmit
      handleSubmit();
    }

    setError('');
  };

  // Add this new step after the guardian step (step 5):

  // After the existing steps, add the location step:
  {
    step === 6 && (
      <div>
        <h2 className="text-2xl font-bold mb-6">Location</h2>
        <p className="mb-4 text-gray-600">
          {age && age >= 16
            ? `As a ${hasGuardian || age >= 21 ? 'Bloom' : 'Bud'} level volunteer, 
             sharing your location helps you find nearby opportunities and connect with local volunteers.`
            : 'Sharing your location helps us find volunteer opportunities near you.'}
        </p>

        <div className="mb-4">
          <p className="font-medium mb-2">Would you like to share your location?</p>
          <p className="text-sm text-gray-500 mb-4">
            This is used only to find volunteer opportunities near you. You can always change this later.
          </p>

          <button
            type="button"
            onClick={() => {
              if (navigator.geolocation) {
                setLoading(true);
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    // Store location temporarily (will be saved during handleSubmit)
                    tempLocation.current = {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                    };
                    setLocationShared(true);
                    setLoading(false);
                  },
                  (error) => {
                    console.error('Error getting location:', error);
                    setError(`Location error: ${error.message}`);
                    setLoading(false);
                  }
                );
              } else {
                setError('Geolocation is not supported by your browser');
              }
            }}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md mb-2"
            disabled={loading || locationShared}
          >
            {loading ? 'Getting location...' :
              locationShared ? 'Location shared ✓' : 'Share my location'}
          </button>

          <button
            type="button"
            onClick={() => {
              tempLocation.current = undefined;
              setLocationShared(false);
            }}
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
            disabled={loading || !locationShared}
          >
            Don't share my location
          </button>
        </div>

        {locationShared && (
          <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md">
            <p className="text-green-800 text-sm">
              Location shared successfully! We'll use this to find volunteer opportunities near you.
            </p>
          </div>
        )}
      </div>
    )
  }

  // Then in your component, add these state variables:

  // Finally, update the handleSubmit function to include location:

  // In the handleSubmit function, modify the profileData to include location:
  const profileData = {
    displayName: name,
    age: age as number,
    country,
    state: showState ? state : undefined,
    weeklyCommitment,
    volunteeringGoal,
    interests,
    rankingPreferences: {
      communityService: communityServiceRank,
      environmentalAction: environmentalActionRank,
      educationYouthSupport: educationYouthSupportRank,
      healthWellness: healthWellnessRank
    },
    level: determineUserLevel(age as number, hasGuardian),
    // Only add location if shared and for Bud and Bloom levels
    location: (determineUserLevel(age as number, hasGuardian) !== 'Sprout' && tempLocation.current)
      ? tempLocation.current
      : { latitude: 0, longitude: 0 } // Default location (indicates "no location")
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (step === 3 && typeof age === 'number' && age < 16) {
      setStep(1);
    } else {
      setStep(step - 1);
    }
  };

  // Handle final submission
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Determine user level based on age and guardian status
      const userLevel = determineUserLevel(age as number, hasGuardian);

      // Create user profile data
      const profileData = {
        displayName: name,
        age: age as number,
        country,
        state: showState ? state : undefined,
        weeklyCommitment,
        volunteeringGoal,
        interests,
        rankingPreferences: {
          communityService: communityServiceRank,
          environmentalAction: environmentalActionRank,
          educationYouthSupport: educationYouthSupportRank,
          healthWellness: healthWellnessRank
        },
        level: determineUserLevel(age as number, hasGuardian),
        // Only add location for Bud and Bloom levels
        location: userLevel !== 'Sprout' ? { latitude: 0, longitude: 0 } : undefined
      };

      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create user profile in Firestore
      await createUserProfile(user, profileData);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${stepNumber === step
                ? 'bg-green-600 text-white'
                : stepNumber < step
                  ? 'bg-green-200 text-green-800'
                  : 'bg-gray-200 text-gray-500'
                }`}
            >
              {stepNumber}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-green-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Step 1: Personal Information */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Tell us about yourself</h2>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="block mb-2 text-sm font-medium">
              Age
            </label>
            <input
              id="age"
              type="number"
              min="5"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="block mb-2 text-sm font-medium">
              Country
            </label>
            <select
              id="country"
              value={country}
              onChange={handleCountryChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select Country</option>
              <option value="Afghanistan">Afghanistan</option>
              <option value="Albania">Albania</option>
              <option value="Algeria">Algeria</option>
              <option value="Andorra">Andorra</option>
              <option value="Angola">Angola</option>
              <option value="Antigua and Barbuda">Antigua and Barbuda</option>
              <option value="Argentina">Argentina</option>
              <option value="Armenia">Armenia</option>
              <option value="Australia">Australia</option>
              <option value="Austria">Austria</option>
              <option value="Azerbaijan">Azerbaijan</option>
              <option value="Bahamas">Bahamas</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Barbados">Barbados</option>
              <option value="Belarus">Belarus</option>
              <option value="Belgium">Belgium</option>
              <option value="Belize">Belize</option>
              <option value="Benin">Benin</option>
              <option value="Bhutan">Bhutan</option>
              <option value="Bolivia">Bolivia</option>
              <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
              <option value="Botswana">Botswana</option>
              <option value="Brazil">Brazil</option>
              <option value="Brunei">Brunei</option>
              <option value="Bulgaria">Bulgaria</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Burundi">Burundi</option>
              <option value="Cabo Verde">Cabo Verde</option>
              <option value="Cambodia">Cambodia</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Canada">Canada</option>
              <option value="Central African Republic">Central African Republic</option>
              <option value="Chad">Chad</option>
              <option value="Chile">Chile</option>
              <option value="China">China</option>
              <option value="Colombia">Colombia</option>
              <option value="Comoros">Comoros</option>
              <option value="Congo (Congo-Brazzaville)">Congo (Congo-Brazzaville)</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="Croatia">Croatia</option>
              <option value="Cuba">Cuba</option>
              <option value="Cyprus">Cyprus</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
              <option value="Denmark">Denmark</option>
              <option value="Djibouti">Djibouti</option>
              <option value="Dominica">Dominica</option>
              <option value="Dominican Republic">Dominican Republic</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Egypt">Egypt</option>
              <option value="El Salvador">El Salvador</option>
              <option value="Equatorial Guinea">Equatorial Guinea</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Estonia">Estonia</option>
              <option value="Eswatini">Eswatini</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Fiji">Fiji</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="Gabon">Gabon</option>
              <option value="Gambia">Gambia</option>
              <option value="Georgia">Georgia</option>
              <option value="Germany">Germany</option>
              <option value="Ghana">Ghana</option>
              <option value="Greece">Greece</option>
              <option value="Grenada">Grenada</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Guinea">Guinea</option>
              <option value="Guinea-Bissau">Guinea-Bissau</option>
              <option value="Guyana">Guyana</option>
              <option value="Haiti">Haiti</option>
              <option value="Honduras">Honduras</option>
              <option value="Hungary">Hungary</option>
              <option value="Iceland">Iceland</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Iran">Iran</option>
              <option value="Iraq">Iraq</option>
              <option value="Ireland">Ireland</option>
              <option value="Israel">Israel</option>
              <option value="Italy">Italy</option>
              <option value="Ivory Coast">Ivory Coast</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Japan">Japan</option>
              <option value="Jordan">Jordan</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Kenya">Kenya</option>
              <option value="Kiribati">Kiribati</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
              <option value="Laos">Laos</option>
              <option value="Latvia">Latvia</option>
              <option value="Lebanon">Lebanon</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Liberia">Liberia</option>
              <option value="Libya">Libya</option>
              <option value="Liechtenstein">Liechtenstein</option>
              <option value="Lithuania">Lithuania</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Madagascar">Madagascar</option>
              <option value="Malawi">Malawi</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Maldives">Maldives</option>
              <option value="Mali">Mali</option>
              <option value="Malta">Malta</option>
              <option value="Marshall Islands">Marshall Islands</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mexico">Mexico</option>
              <option value="Micronesia">Micronesia</option>
              <option value="Moldova">Moldova</option>
              <option value="Monaco">Monaco</option>
              <option value="Mongolia">Mongolia</option>
              <option value="Montenegro">Montenegro</option>
              <option value="Morocco">Morocco</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Myanmar (Burma)">Myanmar (Burma)</option>
              <option value="Namibia">Namibia</option>
              <option value="Nauru">Nauru</option>
              <option value="Nepal">Nepal</option>
              <option value="Netherlands">Netherlands</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Nicaragua">Nicaragua</option>
              <option value="Niger">Niger</option>
              <option value="Nigeria">Nigeria</option>
              <option value="North Korea">North Korea</option>
              <option value="North Macedonia">North Macedonia</option>
              <option value="Norway">Norway</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palau">Palau</option>
              <option value="Palestine">Palestine</option>
              <option value="Panama">Panama</option>
              <option value="Papua New Guinea">Papua New Guinea</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Peru">Peru</option>
              <option value="Philippines">Philippines</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Qatar">Qatar</option>
              <option value="Romania">Romania</option>
              <option value="Russia">Russia</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
              <option value="Saint Lucia">Saint Lucia</option>
              <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
              <option value="Samoa">Samoa</option>
              <option value="San Marino">San Marino</option>
              <option value="Sao Tome and Principe">Sao Tome and Principe</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Senegal">Senegal</option>
              <option value="Serbia">Serbia</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Singapore">Singapore</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Solomon Islands">Solomon Islands</option>
              <option value="Somalia">Somalia</option>
              <option value="South Africa">South Africa</option>
              <option value="South Korea">South Korea</option>
              <option value="South Sudan">South Sudan</option>
              <option value="Spain">Spain</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Sudan">Sudan</option>
              <option value="Suriname">Suriname</option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Syria">Syria</option>
              <option value="Taiwan">Taiwan</option>
              <option value="Tajikistan">Tajikistan</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Thailand">Thailand</option>
              <option value="Timor-Leste">Timor-Leste</option>
              <option value="Togo">Togo</option>
              <option value="Tonga">Tonga</option>
              <option value="Trinidad and Tobago">Trinidad and Tobago</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Turkey">Turkey</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="Tuvalu">Tuvalu</option>
              <option value="Uganda">Uganda</option>
              <option value="Ukraine">Ukraine</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Uruguay">Uruguay</option>
              <option value="Uzbekistan">Uzbekistan</option>
              <option value="Vanuatu">Vanuatu</option>
              <option value="Vatican City">Vatican City</option>
              <option value="Venezuela">Venezuela</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Yemen">Yemen</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>

            </select>
          </div>
          {showState && (
            <div className="mb-4">
              <label htmlFor="state" className="block mb-2 text-sm font-medium">
                State
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select State</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>

                {/* Add all states */}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Commitment */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Commitment</h2>
          <div className="mb-4">
            <label htmlFor="weeklyCommitment" className="block mb-2 text-sm font-medium">
              Maximum Weekly Commitment (1-5 tasks)
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setWeeklyCommitment(num)}
                  className={`w-10 h-10 rounded-full ${weeklyCommitment === num
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="volunteeringGoal" className="block mb-2 text-sm font-medium">
              What is your volunteering goal?
            </label>
            <textarea
              id="volunteeringGoal"
              value={volunteeringGoal}
              onChange={(e) => setVolunteeringGoal(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              rows={4}
              required
              placeholder="e.g., I want to make a difference in my community by..."
            />
          </div>
        </div>
      )}

      {/* Step 3: Interests */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Interests (Optional)</h2>
          <p className="mb-4 text-gray-600">
            Select the areas you're most interested in volunteering for:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`p-3 rounded-md ${interests.includes(interest)
                  ? 'bg-green-100 text-green-800 border-2 border-green-500'
                  : 'bg-gray-100 text-gray-800 border border-gray-300'
                  }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Category Ranking */}
      {step === 4 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Rank Your Preferences</h2>
          <p className="mb-4 text-gray-600">
            Rank these volunteering categories from 1 (most preferred) to 4 (least preferred):
          </p>

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
              <label className="text-sm font-medium">Community Service</label>
            </div>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleRankSelect('community', num)}
                  className={`w-8 h-8 rounded-full ${communityServiceRank === num
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <label className="text-sm font-medium">Environmental Action</label>
            </div>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleRankSelect('environment', num)}
                  className={`w-8 h-8 rounded-full ${environmentalActionRank === num
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
              <label className="text-sm font-medium">Education & Youth Support</label>
            </div>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleRankSelect('education', num)}
                  className={`w-8 h-8 rounded-full ${educationYouthSupportRank === num
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <label className="text-sm font-medium">Health & Wellness</label>
            </div>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleRankSelect('health', num)}
                  className={`w-8 h-8 rounded-full ${healthWellnessRank === num
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Guardian Information */}
      {step === 5 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Guardian Information</h2>
          <p className="mb-4 text-gray-600">
            {age && age < 21 && age >= 16
              ? 'You are eligible for our "Bloom" level with guardian approval.'
              : 'Please provide guardian information to access advanced features.'}
          </p>

          <div className="mb-4">
            <div className="flex items-center">
              <input
                id="hasGuardian"
                type="checkbox"
                checked={hasGuardian}
                onChange={(e) => setHasGuardian(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="hasGuardian" className="text-sm font-medium">
                I want to join the "Bloom" level with guardian supervision
              </label>
            </div>
          </div>

          {hasGuardian && (
            <div className="mb-4">
              <label htmlFor="guardianEmail" className="block mb-2 text-sm font-medium">
                Guardian Email
              </label>
              <input
                id="guardianEmail"
                type="email"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
                placeholder="Your guardian will receive an email to confirm"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            type="button"
            onClick={handlePrevStep}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
          >
            Back
          </button>
        )}
        {step < 5 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md ml-auto"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNextStep}
            disabled={loading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md ml-auto"
          >
            {loading ? 'Creating Profile...' : 'Complete'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
