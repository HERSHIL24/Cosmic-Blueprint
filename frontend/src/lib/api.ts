export async function calculateNumerology(name: string, dob: string, preserveMasterNumbers: boolean = true) {
  const res = await fetch('http://127.0.0.1:8001/api/numerology/calculate/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, dob, preserve_master_numbers: preserveMasterNumbers }),
  });
  
  if (!res.ok) {
    throw new Error('Failed to calculate numerology');
  }
  
  const json = await res.json();
  return json.data || json;
}

export async function generateKundli(dob: string, time: string, lat: number, lon: number) {
  const res = await fetch('http://127.0.0.1:8001/api/astrology/chart/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dob, time, lat, lon }),
  });
  
  if (!res.ok) {
    throw new Error('Failed to generate Kundli');
  }
  
  const json = await res.json();
  return json.data || json;
}

export async function fetchNumberData(number: number) {
  const res = await fetch('/data/numbers.json');
  const data = await res.json();
  return data.find((n: any) => n.number === number);
}
