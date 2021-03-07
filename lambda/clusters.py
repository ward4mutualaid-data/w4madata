from __future__ import annotations

import json
from copy import deepcopy
from dataclasses import dataclass
from math import sqrt
from random import uniform
from statistics import mean, pstdev
import typing as t 


def lambda_handler(event, context):
    print("FULL REQUEST: ", event)
    points = [DataPoint(**point) for point in json.loads(event["body"])]
    max_size = 5
    num_points = len(points)
    if num_points % max_size == 0:
        num_clusters = int(num_points / max_size)
    else:
        num_clusters = int(num_points / max_size) + 1

    kmeans: KMeans[DataPoint] = KMeans(num_clusters, points, max_size=max_size)
    clusters: t.List[Cluster] = kmeans.run()
    flat_clusters = []
    for idx, c in enumerate(clusters, 1):
        for p in c.points:
            serial_p = p.serialize()
            serial_p["cluster"] = idx
            flat_clusters.append(serial_p)
    print("RESPONSE BODY: ", flat_clusters)
    return {
        "statusCode": "200",
        "body": json.dumps(flat_clusters),
        "headers": {
            "Content-Type": "application/json",
        },
    }


def zscores(original: t.Sequence[float]) -> t.List[float]:
    avg: float = mean(original)
    std: float = pstdev(original)
    if std == 0:  # return all zeros if there is no variation
        return [0] * len(original)
    return [(x - avg) / std for x in original]


class DataPoint:
    def __init__(self, coords: t.Iterable[float], _id: t.Any = None, extra_data: t.Optional[t.Dict] = None) -> None:
        self._id: t.Any = _id
        self._originals: t.Tuple[float, ...] = tuple(coords)
        self.dimensions: t.Tuple[float, ...] = tuple(coords)

    @property
    def num_dimensions(self) -> int:
        return len(self.dimensions)

    def distance(self, other: DataPoint) -> float:
        combined: t.Iterator[t.Tuple[float, float]] = zip(self.dimensions, other.dimensions)
        differences: t.List[float] = [(x - y) ** 2 for x, y in combined]
        return sqrt(sum(differences))

    def serialize(self) -> t.Dict:
        serialized: t.Dict = {
            "coords": self._originals,
        }
        if self._id is not None:
            serialized["_id"] = self._id
        return serialized

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, DataPoint):
            return NotImplemented
        return self.dimensions == other.dimensions

    def __repr__(self) -> str:
        return self._originals.__repr__()


Point = t.TypeVar("Point", bound=DataPoint)


@dataclass
class Cluster:
    points: t.List[Point]
    centroid: DataPoint
    max_size: int

    @property
    def is_full(self) -> bool:
        return len(self.points) >= self.max_size


class KMeans(t.Generic[Point]):
    def __init__(self, k: int, points: t.List[Point], max_size=float("inf")) -> None:
        if k < 1:  # k-means can't do negative or zero clusters
            raise ValueError("k must be >= 1")
        self._points: t.List[Point] = points
        self._zscore_normalize()
        # initialize empty clusters with random centroids
        self._clusters: t.List[Cluster] = []
        for _ in range(k):
            rand_point: DataPoint = self._random_point()
            cluster: Cluster = Cluster([], rand_point, max_size)
            self._clusters.append(cluster)

    @property
    def _centroids(self) -> t.List[DataPoint]:
        return [x.centroid for x in self._clusters]

    def _dimension_slice(self, dimension: int) -> t.List[float]:
        return [x.dimensions[dimension] for x in self._points]

    def _zscore_normalize(self) -> None:
        zscored: t.List[t.List[float]] = [[] for _ in range(len(self._points))]
        for dimension in range(self._points[0].num_dimensions):
            dimension_slice: t.List[float] = self._dimension_slice(dimension)
            for index, zscore in enumerate(zscores(dimension_slice)):
                zscored[index].append(zscore)
        for i in range(len(self._points)):
            self._points[i].dimensions = tuple(zscored[i])

    def _random_point(self) -> DataPoint:
        rand_dimensions: t.List[float] = []
        for dimension in range(self._points[0].num_dimensions):
            values: t.List[float] = self._dimension_slice(dimension)
            rand_value: float = uniform(min(values), max(values))
            rand_dimensions.append(rand_value)
        return DataPoint(rand_dimensions)

    # Find the closest cluster centroid to each point and assign the point to that cluster
    def _assign_clusters(self) -> None:
        # [distance to nearest centroid, DataPoint, list of centroids ordered by nearness]
        points_with_nearness: t.List[t.Tuple[float, DataPoint, t.List[DataPoint]]] = []
        for point in self._points:
            centroids_and_distance: t.List[t.Tuple[float, DataPoint]] = [
                (point.distance(cen), cen) for cen in self._centroids
            ]
            # sort centroids in order of nearness
            centroids_and_distance.sort(key=lambda x: x[0])
            points_with_nearness.append(
                # tuple of distance to nearest centroid and centroids ordered by distance
                (
                    centroids_and_distance[0][0],
                    point,
                    [x[1] for x in centroids_and_distance],
                )
            )
        # order by points nearest to centroids
        points_with_nearness.sort(key=lambda x: x[0])
        for _, point, centroids in points_with_nearness:
            for cen in centroids:
                idx: int = self._centroids.index(cen)
                cluster: Cluster = self._clusters[idx]
                if not cluster.is_full:
                    cluster.points.append(point)
                    break

    # Find the center of each cluster and move the centroid to there
    def _generate_centroids(self) -> None:
        for cluster in self._clusters:
            if len(cluster.points) == 0:  # keep the same centroid if no points
                continue
            means: t.List[float] = []
            for dimension in range(cluster.points[0].num_dimensions):
                dimension_slice: t.List[float] = [
                    p.dimensions[dimension] for p in cluster.points
                ]
                means.append(mean(dimension_slice))
            cluster.centroid = DataPoint(means)

    def run(self, max_iterations: int = 100) -> t.List[Cluster]:
        for iteration in range(max_iterations):
            for cluster in self._clusters:  # clear all clusters
                cluster.points.clear()
            self._assign_clusters()  # find cluster each point is closest to
            old_centroids: t.List[DataPoint] = deepcopy(self._centroids)  # record
            self._generate_centroids()  # find new centroids
            if old_centroids == self._centroids:  # have centroids moved?
                print(f"Converged after {iteration} iterations")
                return self._clusters
        return self._clusters


if __name__ == "__main__":
    from random import random

    points = [
        DataPoint([round(random() * 20, 1), round(random() * 20, 1)]) for i in range(20)
    ]

    # points = [
    #     DataPoint([0.0, 0.0]),
    #     DataPoint([1.0, 1.0]),
    #     DataPoint([2.0, 2.0]),
    #     DataPoint([3.0, 3.0]),
    #     DataPoint([4.0, 4.0]),
    #     DataPoint([5.0, 5.0]),
    #     DataPoint([6.0, 6.0]),
    #     DataPoint([7.0, 7.0]),
    #     DataPoint([8.0, 8.0]),
    #     DataPoint([9.0, 9.0]),
    # ]
    kmeans_test: KMeans[DataPoint] = KMeans(4, points, max_size=5)
    test_clusters: t.List[Cluster] = kmeans_test.run()
    for index, cluster in enumerate(test_clusters):
        # print(f"Cluster {index}")
        print()
        for p in cluster.points:
            print(f"{p._originals[0]} {p._originals[1]} ", end="")
    print()