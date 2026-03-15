import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProfile, useSettings, deleteProfile } from '../hooks/useFirebase';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Edit, Trash2, User, FileText, MessageSquare, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function ProfileDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  
  const profile = useProfile(id);
  const settings = useSettings();

  if (profile === undefined || settings === undefined) return <div className="p-8 text-center">Loading...</div>;
  if (profile === null) return <div className="p-8 text-center">Profile not found.</div>;

  const confirmDelete = async () => {
    await deleteProfile(id!);
    navigate('/profiles');
  };

  return (
    <>
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 overflow-hidden"
            >
              <div className="flex items-center space-x-4 mb-4 text-red-600">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Delete Profile</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this profile? This action cannot be undone and all data will be permanently lost.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
                >
                  Delete Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors text-slate-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt={profile.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-white shadow-sm">
                <User className="w-8 h-8 text-emerald-600" />
              </div>
            )}
            <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
          </div>
        </div>
        {role === 'admin' && (
          <div className="flex space-x-3">
            <Link 
              to={`/edit/${profile.id}`}
              className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Link>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center">
              <User className="w-5 h-5 text-slate-500 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-slate-900">Basic Information</h3>
            </div>
            <div className="px-6 py-5">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-slate-500">Full name</dt>
                  <dd className="mt-1 text-sm text-slate-900 font-semibold">{profile.name}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-slate-500">Father/Husband Name</dt>
                  <dd className="mt-1 text-sm text-slate-900">{profile.fatherName}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-slate-500">CNIC</dt>
                  <dd className="mt-1 text-sm text-slate-900">{profile.cnic}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-slate-500">Phone</dt>
                  <dd className="mt-1 text-sm text-slate-900">{profile.phoneNumber}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-slate-500">Application No.</dt>
                  <dd className="mt-1 text-sm text-slate-900">{profile.applicationNumber}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-slate-500">District</dt>
                  <dd className="mt-1 text-sm text-slate-900">{profile.district}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-slate-500">Address</dt>
                  <dd className="mt-1 text-sm text-slate-900">{profile.address}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-slate-500">Support to sustain livelihood</dt>
                  <dd className="mt-1 text-sm text-slate-900">{profile.supportToSustainLivelihood || <span className="text-slate-400 italic">Not answered</span>}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-slate-500 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-slate-900">Questionnaire Responses</h3>
              </div>
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors"
              >
                {showAnswers ? 'Hide answers' : 'View all answers'}
              </button>
            </div>
            {showAnswers && (
              <div className="px-6 py-5">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  {settings?.questions?.map((q) => {
                  let answer = profile.answers?.[q.id];
                  if (answer === undefined) {
                    answer = (profile as any)[q.id];
                  }

                  let conditionalAnswer = profile.conditionalAnswers?.[q.id];
                  if (conditionalAnswer === undefined) {
                    if (q.id === 'governmentSupport') conditionalAnswer = (profile as any).governmentSupportAmount;
                    if (q.id === 'externalSupport') conditionalAnswer = (profile as any).externalSupportAmount;
                    if (q.id === 'debtForBasicNeeds') conditionalAnswer = (profile as any).debtAmount;
                    if (q.id === 'disabilityInHousehold') conditionalAnswer = (profile as any).disabilityType;
                    if (q.id === 'houseStatus') conditionalAnswer = (profile as any).rentAmount;
                  }
                  
                  // Check if this question depends on another
                  if (q.dependsOnQuestionId && q.dependsOnAnswer) {
                    let parentAnswer = profile.answers?.[q.dependsOnQuestionId];
                    if (parentAnswer === undefined) {
                      parentAnswer = (profile as any)[q.dependsOnQuestionId];
                    }
                    if (String(parentAnswer) !== String(q.dependsOnAnswer)) {
                      return null; // Don't render if condition is not met
                    }
                  }

                  let points = 0;
                  let conditionalPoints = 0;
                  let rangeLabel = '';
                  if (answer !== undefined && answer !== null && answer !== '') {
                    if (q.type === 'boolean') {
                      points = answer === 'Yes' ? (q.scoreIfTrue || 0) : 0;
                    } else if (q.type === 'range' && q.options) {
                      const numValue = Number(answer);
                      const option = q.options.find(o => {
                        const min = (o.min === undefined || o.min === null || isNaN(o.min)) ? -Infinity : o.min;
                        const max = (o.max === undefined || o.max === null || isNaN(o.max)) ? Infinity : o.max;
                        return numValue >= min && numValue <= max;
                      });
                      if (option) {
                        points = option.score;
                        rangeLabel = option.label;
                      }
                    } else {
                      const selectedOption = q.options?.find(o => o.label === answer);
                      points = selectedOption?.score || 0;
                    }

                    if (q.hasConditionalField && q.conditionalTrigger === String(answer) && conditionalAnswer) {
                      conditionalPoints = q.conditionalScore || 0;
                    }
                  }

                  const totalPoints = points + conditionalPoints;

                  return (
                    <div key={q.id} className="sm:col-span-2">
                      <dt className="text-sm font-medium text-slate-500">{q.text}</dt>
                      <dd className="mt-2 text-sm text-slate-900 flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                        <span>
                          {answer !== undefined && answer !== null && answer !== '' ? (
                            <span className="font-medium text-emerald-700">
                              {String(answer)}
                              {rangeLabel && <span className="ml-2 text-slate-500 font-normal">({rangeLabel})</span>}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Not answered</span>
                          )}
                          {q.hasConditionalField && q.conditionalTrigger === String(answer) && conditionalAnswer && (
                            <span className="ml-2 text-slate-600 italic">
                              ({q.conditionalLabel}: {conditionalAnswer})
                            </span>
                          )}
                        </span>
                        {answer && (
                          <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-md text-xs">
                            {totalPoints > 0 ? `+${totalPoints}` : totalPoints} pts
                          </span>
                        )}
                      </dd>
                      {q.followUps && (
                        <FollowUpDisplay 
                          configs={q.followUps} 
                          parentAnswer={answer} 
                          conditionalAnswers={profile.conditionalAnswers} 
                        />
                      )}
                    </div>
                  );
                })}

                {/* Legacy Responses Section */}
                {(() => {
                  const standardKeys = ['id', 'applicationNumber', 'district', 'name', 'fatherName', 'cnic', 'address', 'phoneNumber', 'supportToSustainLivelihood', 'professionOfOthers', 'profilePicture', 'comments', 'answers', 'conditionalAnswers', 'score', 'scoreBreakdown', 'createdAt', 'updatedAt'];
                  const currentQuestionIds = settings?.questions?.map(q => q.id) || [];
                  
                  const legacyRootAnswers = Object.keys(profile)
                    .filter(key => !standardKeys.includes(key) && !currentQuestionIds.includes(key))
                    .map(key => ({ key, value: (profile as any)[key] }));

                  const legacyAnswersObj = profile.answers || {};
                  const legacyNestedAnswers = Object.keys(legacyAnswersObj)
                    .filter(key => !currentQuestionIds.includes(key))
                    .map(key => ({ key, value: legacyAnswersObj[key] }));

                  const allLegacyAnswers = [...legacyRootAnswers, ...legacyNestedAnswers].filter(item => item.value !== undefined && item.value !== null && item.value !== '');

                  if (allLegacyAnswers.length === 0) return null;

                  return (
                    <div className="sm:col-span-2 mt-6 pt-6 border-t border-slate-200">
                      <h4 className="text-md font-semibold text-slate-700 mb-4">Legacy Responses (from older versions)</h4>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                        {allLegacyAnswers.map((item, idx) => (
                          <div key={`legacy-${idx}`} className="sm:col-span-2">
                            <dt className="text-sm font-medium text-slate-500 capitalize">{item.key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                            <dd className="mt-2 text-sm text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">
                              <span className="font-medium text-slate-700">{String(item.value)}</span>
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  );
                })()}
              </dl>
            </div>
            )}
          </div>

          {profile.comments && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center">
                <MessageSquare className="w-5 h-5 text-slate-500 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-slate-900">Comments / Summary</h3>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm text-slate-900 whitespace-pre-wrap">{profile.comments}</p>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Score */}
        <div className="space-y-6">
          <div className="bg-emerald-600 rounded-2xl shadow-lg overflow-hidden text-white">
            <div className="px-6 py-8 text-center">
              <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider mb-2">Applicant Score</p>
              <p className="text-6xl font-black">{profile.score || 0}</p>
            </div>
            <div className="bg-emerald-700 px-6 py-4">
              <h4 className="text-sm font-semibold mb-3 text-emerald-100 border-b border-emerald-600 pb-2">Score Breakdown</h4>
              <ul className="space-y-3 text-sm">
                {Object.entries(profile.scoreBreakdown || {}).map(([key, value]) => {
                  const q = settings?.questions?.find(q => q.text === key);
                  let answerText = '';
                  if (q) {
                    let answer = profile.answers?.[q.id];
                    if (answer === undefined) answer = (profile as any)[q.id];
                    
                    if (answer !== undefined && answer !== null && answer !== '') {
                      answerText = String(answer);

                      if (q.type === 'range' && q.options) {
                        const numValue = Number(answer);
                        const option = q.options.find(o => {
                          const min = (o.min === undefined || o.min === null || isNaN(o.min)) ? -Infinity : o.min;
                          const max = (o.max === undefined || o.max === null || isNaN(o.max)) ? Infinity : o.max;
                          return numValue >= min && numValue <= max;
                        });
                        if (option) {
                          answerText += ` (${option.label})`;
                        }
                      }
                      
                      // Add conditional answer if it exists
                      if (q.hasConditionalField && q.conditionalTrigger === String(answer)) {
                        let condAnswer = profile.conditionalAnswers?.[q.id];
                        if (condAnswer === undefined) {
                          if (q.id === 'governmentSupport') condAnswer = (profile as any).governmentSupportAmount;
                          if (q.id === 'externalSupport') condAnswer = (profile as any).externalSupportAmount;
                          if (q.id === 'debtForBasicNeeds') condAnswer = (profile as any).debtAmount;
                          if (q.id === 'disabilityInHousehold') condAnswer = (profile as any).disabilityType;
                          if (q.id === 'houseStatus') condAnswer = (profile as any).rentAmount;
                        }
                        if (condAnswer !== undefined && condAnswer !== null && condAnswer !== '') {
                          answerText += ` (${condAnswer})`;
                        }
                      }
                    }
                  }

                  return (
                    <li key={key} className="flex flex-col border-b border-emerald-600/50 pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <span className="text-emerald-100 pr-2">{key}</span>
                        <span className="font-bold whitespace-nowrap">{Number(value) > 0 ? `+${value}` : value}</span>
                      </div>
                      {answerText && (
                        <div className="mt-1.5 inline-block bg-emerald-800/40 text-emerald-50 px-2 py-1 rounded text-xs font-medium w-fit">
                          Response: {answerText}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h4 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">Record Metadata</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Created</span>
                <span className="text-slate-900 font-medium">{profile.createdAt ? new Date(profile.createdAt).toLocaleString() : 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Modified</span>
                <span className="text-slate-900 font-medium">{profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      </motion.div>
    </>
  );
}

function FollowUpDisplay({ configs, parentAnswer, conditionalAnswers }: { configs: any[], parentAnswer: any, conditionalAnswers: any }) {
  return (
    <div className="space-y-4 mt-4">
      {configs.map(fu => {
        if (String(parentAnswer) !== String(fu.triggerValue)) return null;

        const answer = conditionalAnswers?.[fu.id];
        let points = 0;
        let rangeLabel = '';

        if (answer !== undefined && answer !== null && answer !== '') {
          if (fu.type === 'boolean') {
            points = answer === 'Yes' ? (fu.scoreIfTrue || 0) : 0;
          } else if (fu.type === 'range' && fu.options) {
            const numValue = Number(answer);
            const option = fu.options.find((o: any) => {
              const min = (o.min === undefined || o.min === null || isNaN(o.min)) ? -Infinity : o.min;
              const max = (o.max === undefined || o.max === null || isNaN(o.max)) ? Infinity : o.max;
              return numValue >= min && numValue <= max;
            });
            if (option) {
              points = option.score;
              rangeLabel = option.label;
            }
          } else if (fu.type === 'select' && fu.options) {
            const selectedOption = fu.options.find((o: any) => o.label === answer);
            points = selectedOption?.score || 0;
          } else if (fu.type === 'text' || fu.type === 'number') {
            points = fu.scoreIfAnswered || 0;
          }
        }

        return (
          <div key={fu.id} className="pl-4 border-l-2 border-emerald-100 space-y-2">
            <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">{fu.label}</dt>
            <dd className="text-sm text-slate-900 flex items-center justify-between bg-slate-50/50 p-2 rounded-lg border border-slate-100">
              <span>
                {answer !== undefined && answer !== null && answer !== '' ? (
                  <span className="font-medium text-emerald-600">
                    {String(answer)}
                    {rangeLabel && <span className="ml-2 text-slate-400 font-normal">({rangeLabel})</span>}
                  </span>
                ) : (
                  <span className="text-slate-400 italic">Not answered</span>
                )}
              </span>
              {answer !== undefined && answer !== null && answer !== '' && (
                <span className="text-emerald-600 font-bold text-xs">
                  {points > 0 ? `+${points}` : points} pts
                </span>
              )}
            </dd>
            {fu.followUps && (
              <FollowUpDisplay 
                configs={fu.followUps} 
                parentAnswer={answer} 
                conditionalAnswers={conditionalAnswers} 
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
