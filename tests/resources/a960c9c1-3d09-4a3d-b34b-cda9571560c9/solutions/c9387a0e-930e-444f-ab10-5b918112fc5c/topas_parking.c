#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <assert.h>
#include <limits.h>

#define MAX_MOOSHAK_LINES 10000

int min(int x, int y)
{
  return x <= y ? x : y;
}

int max(int x, int y)
{
  return x <= y ? y : x;
}

int ints_min(const int *a, int n)
{
  int result = INT_MAX;
  for (int i = 0; i < n; i++)
    if (result > a[i])
      result = a[i];
  return result;
}

void ints_print(int *a, int n, char *separator)
{
  if (n > 0)
  {
    printf("%d", a[0]);
    for (int i = 1; i < n; i++)  // i = 1
      printf("%s%d", separator, a[i]);
  }
}

void ints_println(int *a, int n, char *separator)
{
  ints_print(a, n, separator);
  printf("\n");
}

void ints_printf(int *a, int n, const char *fmt)
{
  for (int i = 0; i < n; i++)
    printf(fmt, a[i]);
}

void ints_printfln(int *a, int n, const char *fmt)
{
  ints_printf(a, n, fmt);
  printf("\n");
}

void ints_exchange(int *a, int x, int y)
{
  int m = a[x];
  a[x] = a[y];
  a[y] = m;
}

int ints_id(int n, int *a)
{
  int result = 0;
  for (int i = 0; i < n; i++)
    a[result++] = i;
  return result;
}


//-----------

int rand_to(int n)  /* random numbers from 0 to n, inclusive */
// most recent version working on Mac. Not tested on Windows
{
  unsigned int m = (unsigned int) RAND_MAX + 1;
  // implicitly divide range [0..m] into n+1 ranges of w numbers:
  // [0..w-1], [w..2*w-1], [2*w..3*w-1], ... [n*w, (n+1)*w-1]
  unsigned int u_n = (unsigned int) n;
  unsigned int w = m / (u_n+1);
  // random numbers greater or equal to limit are ignored:
  unsigned int limit = (u_n+1) * w;
  int r;
  do
    // generate a random number:
    r = rand();
  // if greater than limit, ignore and repeat:
  while ((unsigned int)r >= limit);
  // compute the number of the range to which r belongs
  // this is a number in the range [0..n]
  // it's the random number we wanted:
  return r / w;
}

void ints_shuffle(int *a, int n)
{
  int i;
  for (i = 0; i < n-1; i++)
    ints_exchange(a, i, i+rand_to(n-1-i));
}

char *str_dup(const char *s)
{
  char *result = (char *) malloc(strlen(s) + 1);
  strcpy(result, s);
  return result;
}

int ints_equal_arrays(const int *a, const int n, const int *b, int m)
{
  int result = n == m;
  int i = 0;
  while (result && i < n)
    if (a[i] != b[i])
      result = 0;
    else
      i++;
  return result;
}

int ints_copy(const int *a, int n, int *b)
{
  if (n < 0)
    n = 0;
  memmove(b, a, n * sizeof(int));  // Note: 3rd arg is unsigned.
  return n;
}

// --------------

int *ints_new (int n)
{
  return (int *) malloc (n * sizeof(int));
}

void ints_clear(int *a, int n)
{
  memset(a, 0, n * sizeof(int));
}

int **ints2_new(int rows, int cols)
{
  int **result = (int **) malloc(rows * sizeof(int *));
  int *p = ints_new(rows * cols);
  for (int i = 0; i < rows; i++, p += cols)
    result[i] = p;
  return result;
}

int ints_get_some(int *a, int n)
{
  int result = 0;
  int x;
  while (result < n && scanf("%d", &x) != EOF)
    a[result++] = x;
  return result;
}

void ints2_get(int **m, int rows, int columns)
{
  ints_get_some(*m, rows * columns);
}


#define ISOLATED 0
#define EMPTY 1
#define OCCUPIED 2
#define BLOCKING 3


int ints2_get_sparse_x_y_one(int **m, int rows, int columns)
{
  int result = 0;
  int x, y;
  ints_clear(*m, rows * columns);
  while (scanf("%d%d", &x, &y) != EOF)
  {
    m[y][x] = OCCUPIED;
    result++;
  }
  return result;
}

int ints2_get_sparse_x_y_one_topas(int **m, int rows, int columns)
{
  int result = 0;
  int x, y;
  ints_clear(*m, rows * columns);
  while (scanf("%d%d", &x, &y) && x != -1 && y != -1)
  {
    m[y][x] = OCCUPIED;
    result++;
  }
  return result;
}

void ints2_printf(int **m, int rows, int columns, const char *fmt)
{
  for (int i = 0; i < rows; i++)
    ints_printfln(m[i], columns, fmt);
}

// --------------

int is_blocked(int **m, int rows, int columns, int r, int c)
{
  assert (m[r][c] == OCCUPIED);
  int result = 0;
  if (r > 0 && r+1 < rows && c > 0 && c+1 < columns)
    result = (m[r-1][c] == OCCUPIED || m[r-1][c] == ISOLATED) &&
      (m[r][c+1] == OCCUPIED || m[r][c+1] == ISOLATED) &&
      (m[r+1][c] == OCCUPIED || m[r+1][c] == ISOLATED) &&
      (m[r][c-1] == OCCUPIED || m[r][c-1] == ISOLATED);
  return result;
}

void semaphores(int **m, int rows, int columns)
{
  for (int i = 0; i < rows; i++)
    for (int j = 0; j < columns; j++)
      if (m[i][j] == EMPTY)
      {
        m[i][j] = OCCUPIED;
        if ((i > 0 && m[i-1][j] == OCCUPIED && is_blocked(m, rows, columns, i-1, j)) ||
            (j+1 < columns && m[i][j+1] == OCCUPIED && is_blocked(m, rows, columns, i, j+1)) ||
            (i+1 < rows && m[i+1][j] == OCCUPIED && is_blocked(m, rows, columns, i+1, j)) ||
            (j > 0 && m[i][j-1] == OCCUPIED && is_blocked(m, rows, columns, i, j-1)))
          m[i][j] = BLOCKING;
        else
          m[i][j] = EMPTY;
      }
}

// --------------

void accessibleFrom(int **m, int rows, int columns, int x, int y)
{
  m[y][x] = EMPTY;
  if (x+1 < columns && m[y][x+1] == ISOLATED)
    accessibleFrom(m, rows, columns, x+1, y);
  if (y > 0 && m[y-1][x] == ISOLATED)
    accessibleFrom(m, rows, columns, x, y-1);
  if (x > 0 && m[y][x-1] == ISOLATED)
    accessibleFrom(m, rows, columns, x-1, y);
  if (y+1 < rows && m[y+1][x] == ISOLATED)
    accessibleFrom(m, rows, columns, x, y+1);
}

void inaccessible(int **m, int rows, int columns)
{
  for (int j = 0; j < columns-1; j++)
    if (m[0][j] == ISOLATED)
      accessibleFrom(m, rows, columns, j, 0);
  for (int i = 0; i < rows-1; i++)
    if (m[i][columns-1] == ISOLATED)
      accessibleFrom(m, rows, columns, columns-1, i);
  for (int j = columns-1; j > 0; j--)
    if (m[rows-1][j] == ISOLATED)
      accessibleFrom(m, rows, columns, j, rows-1);
  for (int i = rows-1; i > 0; i--)
    if (m[i][0] == ISOLATED)
      accessibleFrom(m, rows, columns, 0, i);
}

void test_accessible()
{
  int w, h;
  scanf("%d%d", &w, &h);
  printf("%d %d\n", w, h);
  int **m = ints2_new(h, w);
  ints2_get_sparse_x_y_one_topas(m, h, w);
  ints2_printf(m, h, w, "%d");
  printf("----\n");
  inaccessible(m, h, w);
  ints2_printf(m, h, w, "%d");
}

// --------------

void task_parking_detailed(void)
{
  int w, h;
  scanf("%d%d", &w, &h);
  int **m = ints2_new(h, w);
  ints2_get_sparse_x_y_one_topas(m, h, w);
  ints2_printf(m, h, w, "%d");
  printf("----\n");
  inaccessible(m, h, w);
  ints2_printf(m, h, w, "%d");
  printf("----\n");
  semaphores(m, h, w);
  ints2_printf(m, h, w, "%d");
}

void task_parking(void)
{
  int w, h;
  scanf("%d%d", &w, &h);
  int **m = ints2_new(h, w);
  ints2_get_sparse_x_y_one_topas(m, h, w);
  inaccessible(m, h, w);
  semaphores(m, h, w);
  ints2_printf(m, h, w, "%d");
}

void do_create_test_file(void)
{
  int w, h;
  double p;
  scanf("%d%d%lf", &w, &h, &p);
  int n = w*h;
  int a[n];
  ints_id(n, a);
  ints_shuffle(a, n);
  int m = (int) (n * p);
  printf("%d %d\n", w, h);
  for (int i = 0; i < m; i++)
  {
    int x = a[i] % w;
    int y = a[i] / w;
    printf("%d %d\n", x, y);
  }
}


int main(int argc, char **argv)
{
  // unit_tests();
  int x = 'B';
  if (argc > 1)
    x = *argv[1];
  if (x == 'A')
    task_parking();
  else if (x == 'B')
    task_parking_detailed();
  else if (x == 'C')
    test_accessible();
  else if (x == 'T')
    do_create_test_file();
  return 0;
}

