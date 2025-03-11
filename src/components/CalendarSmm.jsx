// filepath: /home/adam-noah/app.nextnoetics/src/components/CalendarSmm.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion } from 'framer-motion';
import EventForm from './calendar/EventForm';
import EventDetails from './calendar/EventDetails';
import AccessTokenModal from './calendar/AccessTokenModal';

const localizer = momentLocalizer(moment);

const CalendarSmm = () => {
  const [events, setEvents] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEventDetailsModalVisible, setIsEventDetailsModalVisible] = useState(false);
  const [isAccessTokenModalVisible, setIsAccessTokenModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    post_due_date: '',
    sm_platform: 'Facebook',
    status: 'Draft',
    post_automatically: false,
    template_id: '',
  });
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [accessTokens, setAccessTokens] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("smm_calendar").select("*");
      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setEvents(data.map((event) => ({
          ...event,
          start: new Date(event.post_due_date),
          end: new Date(event.post_due_date),
        })));
      }
    };
    fetchEvents();

    const fetchTemplates = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("User not authenticated");
        return;
      }
    
      const { data, error } = await supabase
        .from("templates")
        .select("id, name")
        .eq("user_id", user.id);
    
      if (error) {
        console.error("Error fetching templates:", error);
      } else {
        setTemplates(data);
      }
    };

    fetchTemplates();

    const fetchSubscriptionPlan = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("plan")
          .eq("user_id", user.id)
          .single();
        if (error) {
          console.error("Error fetching subscription plan:", error);
        } else {
          setSubscriptionPlan(data.plan);
        }
      }
    };
    fetchSubscriptionPlan();

    const fetchAccessTokens = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("user_access_tokens")
          .select("platform, access_token")
          .eq("user_id", user.id);
        if (error) {
          console.error("Error fetching access tokens:", error);
        } else {
          const tokens = data.reduce((acc, token) => {
            acc[token.platform] = token.access_token;
            return acc;
          }, {});
          setAccessTokens(tokens);
        }
      }
    };
    fetchAccessTokens();
  }, [accessTokens]);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const { title, description, post_due_date, sm_platform, status, post_automatically, template_id } = formValues;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    const user_id = user.id;

    // Ensure all required fields are defined
    if (!title || !description || !post_due_date || !sm_platform || !status) {
      console.error("Missing required fields");
      return;
    }

    // Check posting limits based on subscription plan
    const currentMonth = new Date(post_due_date).getMonth();
    const currentYear = new Date(post_due_date).getFullYear();
    const monthlyPosts = events.filter(event => {
      const eventDate = new Date(event.post_due_date);
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    }).length;

    let maxPostsPerMonth;
    switch (subscriptionPlan) {
      case 'free':
        maxPostsPerMonth = 3;
        break;
      case 'basic':
        maxPostsPerMonth = 30;
        break;
      case 'pro':
        maxPostsPerMonth = Infinity;
        break;
      default:
        maxPostsPerMonth = 0;
    }

    if (monthlyPosts >= maxPostsPerMonth) {
      console.error("Monthly posting limit reached");
      return;
    }

    const { data, error } = await supabase.from("smm_calendar").insert([
      { title, description, post_due_date, sm_platform, status, post_automatically, user_id, template_id: template_id || null },
    ]);

    if (error) {
      console.error("Error adding event:", error);
    } else {
      if (data) {
        setEvents([...data, ...events.map((event) => ({
          ...event,
          start: new Date(event.post_due_date),
          end: new Date(event.post_due_date),
        }))]);
      }
      setIsModalVisible(false);
      setFormValues({
        title: '',
        description: '',
        post_due_date: '',
        sm_platform: 'Facebook',
        status: 'Draft',
        post_automatically: false,
        template_id: '',
      });
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    const { title, description, post_due_date, sm_platform, status, post_automatically, template_id } = formValues;
    const { error } = await supabase
      .from("smm_calendar")
      .update({ title, description, post_due_date, sm_platform, status, post_automatically, template_id: template_id || null })
      .eq("id", selectedEvent.id);

    if (error) {
      console.error("Error updating event:", error);
    } else {
      setEvents(events.map((event) => (event.id === selectedEvent.id ? { ...event, ...formValues, start: new Date(formValues.post_due_date), end: new Date(formValues.post_due_date) } : event)));
      setIsEventDetailsModalVisible(false);
      setSelectedEvent(null);
    }
  };

  const handleDeleteEvent = async () => {
    const { error } = await supabase.from("smm_calendar").delete().eq("id", selectedEvent.id);

    if (error) {
      console.error("Error deleting event:", error);
    } else {
      setEvents(events.filter((event) => event.id !== selectedEvent.id));
      setIsEventDetailsModalVisible(false);
      setSelectedEvent(null);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setFormValues(event);
    setIsEventDetailsModalVisible(true);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const checked = e.target.checked;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-4"
    >
      <style jsx>{`
        .modal {
          display: flex;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.5);
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background-color: #fff;
          padding: 20px;
          border: 1px solid #888;
          width: 80%;
          max-width: 500px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
        }
        .close:hover,
        .close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }
      `}</style>
      <div className="flex flex-col-reverse justify-center gap-4 mx-12">
        <div className="flex-1 ">
          <h2 className="text-4xl font-semibold my-4 text-gray-800 text-center">
            Social Media Calendar
          </h2>
          <div className="flex items-end justify-between mb-10 w-full">
            <div className="bg-white px-2 py-4 shadow-md mt-3 flex flex-col items-start justify-start gap-2 rounded-md">
              <h2 className="text-base font-semibold text-center text-gray-800 ">
                Add an event to any of your social media platforms
              </h2>
              <button
                className="text-lg onboardbutton text-white px-3 py-1 inline-flex justify-center w-full shadow-md rounded-md"
                onClick={() => setIsModalVisible(true)}
              >
                Add SMM Event
              </button>
            </div>
            <div className="bg-white  px-2 py-4 shadow-md mt-3 flex flex-col items-start justify-start gap-2 rounded-md">
              <h2 className="text-lg font-semibold text-center text-gray-800">
                Connect to Your Social Media Platforms
              </h2>
              <button
                className="text-base bg-blue-500 mv-2 self-center text-white font-semibold px-3 py-1 shadow-md rounded-md"
                onClick={() => setIsAccessTokenModalVisible(true)}
              >
                Add Access Token
              </button>
            </div>
          </div>
          <div className="p-1 text-nowrap rounded-lg text-gray-900  w-auto bg-white">
            <div style={{ height: 500, width: '100%', backgroundColor: 'white' }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={(event) => handleEventClick(event)}
              />
            </div>
          </div>
        </div>
        <div className="lg:w-1/6"></div>
      </div>

      {isModalVisible && (
        <EventForm
          formValues={formValues}
          handleChange={handleChange}
          handleSubmit={handleAddEvent}
          templates={templates}
          setIsModalVisible={setIsModalVisible}
        />
      )}

      {isEventDetailsModalVisible && (
        <EventDetails
          formValues={formValues}
          handleChange={handleChange}
          handleSubmit={handleUpdateEvent}
          handleDelete={handleDeleteEvent}
          templates={templates}
          setIsEventDetailsModalVisible={setIsEventDetailsModalVisible}
        />
      )}

      {isAccessTokenModalVisible && (
        <AccessTokenModal
          setIsAccessTokenModalVisible={setIsAccessTokenModalVisible}
        />
      )}
    </motion.div>
  );
};

export default CalendarSmm;