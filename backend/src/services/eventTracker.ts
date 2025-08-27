import prisma from "../lib/client.js";

type TrackEventProps = {
    event_name: string;
    user_id: string;
    event_properties?: {
        [key: string]: any;
    };
    experiment_id?: string;
    variant_id?: string;
    device_type?: string;
    platform?: string;
    session_id: string;
  };

  export async function trackEvent(event: TrackEventProps) {

    const { 
        event_name, 
        user_id, 
        event_properties, 
        experiment_id, 
        variant_id, 
        device_type, 
        platform,
        session_id  
    } = event;

    try{
        const data: any = {
            event_name,
            user_id,
            event_properties: event_properties || {},
            device_type: device_type || "unknown",
            platform: platform || "unknown",
            session_id: session_id
        };

        if (experiment_id) data.experiment_id = experiment_id;
        if (variant_id) data.variant_id = variant_id;

        const eventData = await prisma.events.create({ data });
        return eventData;
    } catch(error) {
        console.error('Error tracking event:', error);
        throw error;
    }
  }