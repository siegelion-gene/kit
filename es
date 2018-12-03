from elasticsearch import Elasticsearch
from elasticsearch import helpers


def copy_index(source_host, target_host, index, size=10000):
    port = 9200
    scroll_body = {
        'size' : size,
        'query': {
            'match_all' : {}
        }
    }

    source_es = Elasticsearch(hosts=source_host, port=port)
    target_es = Elasticsearch(hosts=target_host, port=port)

    res = source_es.search(index=index, body=scroll_body, scroll='1m')

    scroll_id = res['_scroll_id']
    docs   = res["hits"]["hits"]
    bulk_index(target_es, docs)

    while 1:
        res = source_es.scroll(scroll_id=scroll_id)
        docs = res["hits"]["hits"]
        if len(docs) < 1:
            break
        bulk_index(target_es, docs)

    source_es.clear_scroll(scroll_id)


def bulk_index(client, actions):
    for action in actions:
        action['_op_type'] = 'index'

    helpers.bulk(client=client, actions=actions)

    for status, response in helpers.streaming_bulk(client, actions):
        if not status:
            print(response)


if __name__ == "__main__":
    source_host = "127.0.0.1"
    target_host = "127.0.0.1"
    index = "product_detail_data"
    copy_index(source_host, target_host, index)
