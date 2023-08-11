export interface AccOrderData {
    id: number;
    service_name: string;
    start_date: Date;
    start_time: string;
    end_date: Date | null;
    end_time: string | null;
    client_first_name: string;
    client_last_name: string;
    client_phone_number: string;
    origin_lat: number;
    origin_lng: number;
    destination_lat: number | null;
    destination_lng: number | null;
    total: string;
    employee_id: number;
    employee_first_name: string;
    employee_last_name: string;
}
