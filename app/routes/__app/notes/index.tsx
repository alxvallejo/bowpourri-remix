import { LoaderArgs, json } from '@remix-run/node';
import { useLoaderData, useOutletContext } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { useUser } from '~/utils';
import {
  CheckIcon,
  CheckBadgeIcon,
  FaceFrownIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import TailwindColor from '../../../tailwindColor';
import { fetchMyNotes } from '~/services/notes';

export default function NotesIndex() {
  const user = useUser();
  const [notes, setNotes] = useState([]);
  const [userData, setUserData] = useState();
  const [newCat, setNewCat] = useState('');
  const [newNote, setNewNote] = useState('');

  const handleSaveNote = async () => {};

  const getNotes = async () => {
    const resp = await fetchMyNotes();
    console.log('resp: ', resp);
    // setNotes(resp)
  };

  useEffect(() => {
    // Get notes
    getNotes();
  }, []);

  return (
    <>
      <div className='container mx-auto'>
        <div className='flex flex-wrap justify-between'>
          <div className='basis-3/4 pr-6 prose'>
            <h1>Notes</h1>
            <div className='w-9/12'>
              <div className='form-control'>
                <div className='input-group text-xl h-10'>
                  <input
                    type='text'
                    placeholder='Add a category'
                    className='input-bordered input w-full max-w-xs'
                    onChange={(e) => setNewCat(e.target.value)}
                  />
                </div>
              </div>
              <div className='form-control mt-6'>
                <div className='input-group text-xl w-full h-10'>
                  <textarea
                    className='textarea textarea-ghost w-full my-6 '
                    placeholder={`What updates do you have?`}
                    onChange={(e) => setNewNote(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className='mt-6'>
                <button
                  className='btn-primary btn'
                  onClick={() => handleSaveNote()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          <div className='basis-1/4'>
            <div className='card border-accent bg-base-200 text-accent'>
              <div className='card-body'>
                <div className='flex items-start justify-start '>
                  <div className='w-100 card-title flex-1 flex-row justify-between'>
                    <h2>Previous Notes</h2>
                    <button className='btn-sm btn-square btn'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-6 w-6'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M4.867 19.125h.008v.008h-.008v-.008z'
                        />
                      </svg>
                    </button>
                  </div>
                  {/* <label
                    className="btn"
                    onClick={() => setShowPlayerScores(true)}
                  >
                    Stats
                  </label> */}
                </div>
                <ul></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
