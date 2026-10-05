"""
Shared proxy helper — routes requests from Django to the Node.js microservice.
"""
import os
import requests
import logging

logger = logging.getLogger(__name__)
NODE_SERVICE_URL = os.environ.get('NODE_SERVICE_URL', 'http://localhost:5000')
TIMEOUT = 30  # seconds


def proxy_to_node(path, method='GET', data=None, files=None, user_id=None):
    """
    Forward a request to the Node.js engine.
    Returns (response_dict_or_list, status_code).
    """
    url = f'{NODE_SERVICE_URL}{path}'
    headers = {}
    if user_id:
        headers['X-User-Id'] = str(user_id)

    logger.debug(f'[proxy] {method} {url} user={user_id}')

    try:
        if method == 'POST':
            if files:
                resp = requests.post(url, files=files, data=data or {}, headers=headers, timeout=TIMEOUT)
            else:
                resp = requests.post(url, json=data or {}, headers=headers, timeout=TIMEOUT)
        elif method == 'GET':
            resp = requests.get(url, params=data, headers=headers, timeout=TIMEOUT)
        elif method == 'PUT':
            resp = requests.put(url, json=data or {}, headers=headers, timeout=TIMEOUT)
        elif method == 'DELETE':
            resp = requests.delete(url, headers=headers, timeout=TIMEOUT)
        else:
            return {'error': f'Unsupported method: {method}'}, 400

        try:
            return resp.json(), resp.status_code
        except ValueError:
            return {'error': 'Invalid JSON from microservice', 'raw': resp.text[:200]}, 502

    except requests.Timeout:
        logger.error(f'[proxy] Timeout calling {url}')
        return {'error': 'Microservice timeout. Please try again.'}, 504

    except requests.ConnectionError:
        logger.error(f'[proxy] Connection refused for {url}')
        return {'error': 'Astrology engine is currently unavailable.'}, 502

    except Exception as e:
        logger.exception(f'[proxy] Unexpected error: {e}')
        return {'error': 'Internal proxy error.'}, 500
