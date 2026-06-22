/**
 * Problem 1: Three ways to sum to n
 *
 * Input:  n- any integer
 * Output: summation to n, i.e. sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15
 *
 * Assumption: input always produces a result < Number.MAX_SAFE_INTEGER.
 * For negative n, the mathematical convention is that the sum is 0.
 */

/**
 * Implementation A- Gauss closed-form formula
 *
 * Uses the arithmetic series identity: sum(1..n) = n * (n + 1) / 2
 *
 * Time  complexity: O(1)
 * Space complexity: O(1)
 */
var sum_to_n_a = function (n) {
  if (n <= 0) return 0;
  return (n * (n + 1)) / 2;
};

/**
 * Implementation B- Iterative loop
 *
 * Accumulates the total in a single pass through [1, n].
 *
 * Time  complexity: O(n)
 * Space complexity: O(1)
 */
var sum_to_n_b = function (n) {
  if (n <= 0) return 0;
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

/**
 * Implementation C- Tail-recursive reduction
 *
 * Breaks the problem into sum(n) = n + sum(n - 1), bottoming out at n === 0.
 *
 * Time  complexity: O(n)
 * Space complexity: O(n)- one stack frame per call
 */
var sum_to_n_c = function (n) {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
};

export { sum_to_n_a, sum_to_n_b, sum_to_n_c };
